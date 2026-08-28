"""HuggingFace-backed audio anti-spoofing detector.

Uses a pretrained wav2vec2 audio-classification pipeline from the HuggingFace
Hub. The model genuinely separates real speech from TTS / voice clones when
loaded. If the model cannot load, errors propagate loudly.
"""

from __future__ import annotations

import logging
import numpy as np

logger = logging.getLogger(__name__)

# Default anti-spoofing model. Labels are 'real' / 'fake'.
DEFAULT_MODEL_ID = "alexandreacff/wav2vec2-large-ft-fake-detection"


def _norm_label(raw: str) -> str:
    """Map a model's class label onto VoiceGuard's {'real','fake'} vocabulary.

    For alexandreacff/wav2vec2-large-ft-fake-detection the model config labels
    are literally "real" and "fake", which map directly.
    """
    s = raw.strip().lower()
    if any(k in s for k in ("fake", "spoof", "ai", "synth", "clone")):
        return "fake"
    if any(k in s for k in ("real", "human", "bona", "genuine")):
        return "real"
    logger.warning("Unknown model label '%s' — defaulting to 'fake'", raw)
    return "fake"


class HFSpoofDetector:
    """Lazy wrapper around a HuggingFace audio-classification pipeline."""

    def __init__(self, model_id: str = DEFAULT_MODEL_ID) -> None:
        self.model_id = model_id
        self._pipe = None
        self._load_error: Exception | None = None

    def _pipeline(self):
        if self._pipe is not None:
            return self._pipe
        if self._load_error is not None:
            raise self._load_error

        try:
            import torch
            from transformers import (
                AutoFeatureExtractor,
                AutoModelForAudioClassification,
                pipeline,
            )

            device = 0 if torch.cuda.is_available() else -1

            # Try loading from local cache first (no network request needed)
            try:
                feature_extractor = AutoFeatureExtractor.from_pretrained(
                    self.model_id, local_files_only=True
                )
                model = AutoModelForAudioClassification.from_pretrained(
                    self.model_id, local_files_only=True
                )
                self._pipe = pipeline(
                    "audio-classification",
                    model=model,
                    feature_extractor=feature_extractor,
                    device=device,
                )
                logger.info("HF model '%s' loaded from local cache", self.model_id)
                return self._pipe
            except Exception:
                pass

            # Download or load from HuggingFace Hub
            feature_extractor = AutoFeatureExtractor.from_pretrained(self.model_id)
            model = AutoModelForAudioClassification.from_pretrained(self.model_id)
            self._pipe = pipeline(
                "audio-classification",
                model=model,
                feature_extractor=feature_extractor,
                device=device,
            )
            logger.info("HF model '%s' loaded successfully", self.model_id)
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
          - detail: dict with 'real_prob', 'fake_prob', 'raw_results'
        """
        pipe = self._pipeline()
        audio_f32 = np.asarray(audio, dtype=np.float32)

        results = pipe({"array": audio_f32, "sampling_rate": int(sr)})

        prob_by_label: dict[str, float] = {}
        for r in results:
            norm = _norm_label(r["label"])
            prob_by_label[norm] = prob_by_label.get(norm, 0.0) + float(r["score"])

        real_prob = prob_by_label.get("real", 0.0)
        fake_prob = prob_by_label.get("fake", 0.0)

        total_p = real_prob + fake_prob
        if total_p > 0:
            real_prob /= total_p
            fake_prob /= total_p

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
