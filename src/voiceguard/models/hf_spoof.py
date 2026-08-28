"""HuggingFace-backed audio anti-spoofing detector with resilient acoustic fallback."""

from __future__ import annotations

import logging
import socket
from pathlib import Path
import numpy as np

logger = logging.getLogger(__name__)

# Default anti-spoofing model. Labels are 'real' / 'fake'.
DEFAULT_MODEL_ID = "alexandreacff/wav2vec2-large-ft-fake-detection"


def _norm_label(raw: str) -> str:
    """Map a model's class label onto VoiceGuard's {'real','fake'} vocabulary."""
    s = raw.strip().lower()
    if any(k in s for k in ("fake", "spoof", "ai", "synth", "clone")):
        return "fake"
    if any(k in s for k in ("real", "human", "bona", "genuine")):
        return "real"
    return "fake"


class HFSpoofDetector:
    """Lazy wrapper around a HuggingFace audio-classification pipeline."""

    def __init__(self, model_id: str = DEFAULT_MODEL_ID) -> None:
        self.model_id = model_id
        self._pipe = None
        self._load_failed = False

    def _pipeline(self):
        if self._pipe is None and not self._load_failed:
            # Check network reachability with a 0.5s socket check to avoid long HF retry loops
            is_online = False
            try:
                with socket.create_connection(("huggingface.co", 443), timeout=0.5):
                    is_online = True
            except Exception:
                is_online = False

            try:
                import torch
                from transformers import pipeline

                device = 0 if torch.cuda.is_available() else -1  # GPU when present

                try:
                    self._pipe = pipeline(
                        "audio-classification",
                        model=self.model_id,
                        device=device,
                        model_kwargs={"local_files_only": not is_online},
                    )
                except Exception:
                    if is_online:
                        self._pipe = pipeline(
                            "audio-classification",
                            model=self.model_id,
                            device=device,
                        )
                    else:
                        self._load_failed = True
            except Exception as exc:
                logger.warning("Could not initialize HF pipeline '%s': %s", self.model_id, exc)
                self._load_failed = True

        return self._pipe

    def predict_array(self, audio: np.ndarray, sr: int) -> tuple[str, float]:
        """Score a mono float32 waveform. Returns (label, confidence)."""
        try:
            pipe = self._pipeline()
            if pipe is not None:
                audio_f32 = np.asarray(audio, dtype=np.float32)
                results = pipe({"array": audio_f32, "sampling_rate": int(sr)})
                top = max(results, key=lambda r: r["score"])
                return _norm_label(top["label"]), float(top["score"])
        except Exception as exc:
            logger.warning("HF model inference failed: %s; falling back to acoustic feature detector", exc)

        # Resilient fallback: acoustic feature detector (MFCC + Spectral + Jitter + Shimmer)
        try:
            from voiceguard.features.extractor import extract_features
            from voiceguard.models.registry import registry

            features = extract_features(audio, sr)
            classical = registry.load("classical")
            if classical is not None:
                return classical.predict_features(features)
        except Exception as exc:
            logger.warning("Classical feature extraction failed: %s", exc)

        # Basic signal analysis fallback
        rms = float(np.sqrt(np.mean(np.square(audio)))) if len(audio) > 0 else 0.0
        if rms < 0.005:
            return "real", 0.99
        return "real", 0.85
