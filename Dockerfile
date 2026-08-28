# Stage 1: Build React Frontend SPA
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Python Backend + Frontend Serving
FROM python:3.12-slim AS base

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc g++ libsndfile1 ffmpeg \
    && rm -rf /var/lib/apt/lists/*

COPY pyproject.toml ./
COPY src/ ./src/
COPY serve.py ./
COPY tests/ ./tests/
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# CPU torch wheels via --extra-index-url in the SAME resolve (mirrors CI):
# installing from PyPI first would pull the ~2.5 GB CUDA torch and then
# downgrade, and a pinned torch 2.1.x predates NumPy 2.x ABI support — it
# crashes on import against this project's numpy>=2.4.6.
RUN pip install --no-cache-dir -e . \
    --extra-index-url https://download.pytorch.org/whl/cpu

# Pre-cache HuggingFace anti-spoofing model weights in the container image
RUN python -c "from transformers import pipeline; pipeline('audio-classification', model='alexandreacff/wav2vec2-large-ft-fake-detection')" || true

EXPOSE 8000

# Use the combined entry point (serve.py) that mounts the API under /api
# and serves the frontend SPA at / — matching the frontend's expectations.
# --proxy-headers + --forwarded-allow-ips "*": trust X-Forwarded-For so
# rate limiting keys on the real client IP.
CMD ["uvicorn", "serve:app", "--host", "0.0.0.0", "--port", "8000", \
     "--proxy-headers", "--forwarded-allow-ips", "*"]
