"""HuggingFace-backed audio anti-spoofing detector.

Uses a pretrained wav2vec2 audio-classification pipeline from the HuggingFace
Hub. The model genuinely separates real speech from TTS / voice clones when
loaded correctly. NO hardcoded fallback scores — if the model cannot load,
errors propagate so the caller gets a real diagnostic.
"""

from __future__ import annotations

import logging
import socket

import numpy as np

logger = logging.getLogger(__name__)

# Default anti-spoofing model. Labels are 'real' / 'fake'.
DEFAULT_MODEL_ID = "alexandreacff/wav2vec2-large-ft-fake-detection"


def _norm_label(raw: str) -> str:
    """Map a model's class label onto VoiceGuard's {'real','fake'} vocabulary.

    For alexandreacff/wav2vec2-large-ft-fake-detection the model config labels
    are literally "real" and "fake", which map directly.  Other models may use
    "bonafide"/"spoof" or "LABEL_0"/"LABEL_1" — handle all known variants.
    """
    s = raw.strip().lower()
    if any(k in s for k in ("fake", "spoof", "ai", "synth", "clone")):
        return "fake"
    if any(k in s for k in ("real", "human", "bona", "genuine")):
        return "real"
    # Unknown label: log it so we can add a mapping, default conservatively
    logger.warning("Unknown model label '%s' — defaulting to 'fake'", raw)
    return "fake"


class HFSpoofDetector:
    """Lazy wrapper around a HuggingFace audio-classification pipeline.

    The pipeline is loaded once and cached for the lifetime of the process.
    If loading fails, the error is stored and re-raised on subsequent calls
    instead of returning hardcoded scores.
    """

    def __init__(self, model_id: str = DEFAULT_MODEL_ID) -> None:
        self.model_id = model_id
        self._pipe = None
        self._load_error: Exception | None = None

    def _pipeline(self):
        if self._pipe is not None:
            return self._pipe
        if self._load_error is not None:
            raise self._load_error

        # Quick network check — avoids 30s+ HF retry loops when offline
        is_online = False
        try:
            with socket.create_connection(("huggingface.co", 443), timeout=1.0):
                is_online = True
        except Exception:
            pass

        try:
            import torch
            from transformers import pipeline

            device = 0 if torch.cuda.is_available() else -1

            # Try local cache first (fast, no network)
            try:
                self._pipe = pipeline(
                    "audio-classification",
                    model=self.model_id,
                    device=device,
                    model_kwargs={"local_files_only": True},
                )
                logger.info("HF model '%s' loaded from local cache", self.model_id)
                return self._pipe
            except Exception:
                if not is_online:
                    err = RuntimeError(
                        f"HF model '{self.model_id}' not in local cache and "
                        f"huggingface.co is unreachable. Pre-download the model "
                        f"during Docker build or set HF_HOME."
                    )
                    self._load_error = err
                    raise err

            # Download from hub
            self._pipe = pipeline(
                "audio-classification",
                model=self.model_id,
                device=device,
            )
            logger.info("HF model '%s' downloaded and loaded", self.model_id)
            return self._pipe

        except Exception as exc:
            self._load_error = exc
            logger.error("Failed to load HF pipeline '%s': %s", self.model_id, exc)
            raise

    def predict_array(self, audio: np.ndarray, sr: int) -> tuple[str, float]:
        """Score a mono float32 waveform. Returns (label, confidence)."""
        label, confidence, _ = self.predict_array_detailed(audio, sr)
        return label, confidence

    def predict_array_detailed(self, audio: np.ndarray, sr: int) -> tuple[str, float, dict]:
        """Score a mono float32 waveform.

        Returns (label, confidence, detail) where:
          - label: 'real' or 'fake'
          - confidence: the winning class probability from the model [0.5, 1.0]
          - detail: dict with 'real_prob' and 'fake_prob' from actual model output
        """
        pipe = self._pipeline()  # raises if model unavailable — no silent fallback
        audio_f32 = np.asarray(audio, dtype=np.float32)

        results = pipe({"array": audio_f32, "sampling_rate": int(sr)})

        # Build probability dict from all model output classes
        prob_by_label: dict[str, float] = {}
        for r in results:
            norm = _norm_label(r["label"])
            prob_by_label[norm] = prob_by_label.get(norm, 0.0) + float(r["score"])

        real_prob = prob_by_label.get("real", 0.0)
        fake_prob = prob_by_label.get("fake", 0.0)

        # Total probability mass normalization (if multiple sublabels)
        total_p = real_prob + fake_prob
        if total_p > 0:
            real_prob /= total_p
            fake_prob /= total_p

        # The winning label is whichever has higher probability
        if fake_prob >= real_prob:
            label, confidence = "fake", fake_prob
        else:
            label, confidence = "real", real_prob

        detail = {
            "real_prob": round(float(real_prob), 6),
            "fake_prob": round(float(fake_prob), 6),
            "raw_results": [{"label": r["label"], "score": round(float(r["score"]), 6)} for r in results],
        }

        logger.debug(
            "HF model scored: label=%s conf=%.4f real=%.4f fake=%.4f",
            label, confidence, real_prob, fake_prob,
        )
        return label, float(confidence), detail
