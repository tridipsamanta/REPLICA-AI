"""Combined server for single-container deployments (Render, Railway, Fly, etc.).

Serves the built React frontend at / and mounts the VoiceGuard FastAPI app
under /api — matching the frontend's same-origin /api base and the production
Nginx layout.  One process, one port, one origin.

The frontend calls:
  POST /api/token   → backend /token
  POST /api/detect  → backend /detect
  WS   /api/ws/stream → backend /ws/stream
  GET  /api/health  → backend /health
  ...

Usage (uvicorn):
    uvicorn serve:app --host 0.0.0.0 --port 8000
"""

import os
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from voiceguard.api.main import app as api_app

# Locate the frontend build.  In the Docker image it's at /app/frontend/dist;
# locally it may be relative to the repo root.
_CANDIDATE_PATHS = [
    Path("/app/frontend/dist"),
    Path(__file__).resolve().parent / "frontend" / "dist",
    Path("frontend/dist"),
]
FRONTEND_DIST = next(
    (p for p in _CANDIDATE_PATHS if p.is_dir() and (p / "index.html").exists()),
    None,
)

# ── Build the root application ────────────────────────────────────────────────

app = FastAPI(title="VoiceGuard", docs_url=None, redoc_url=None)

# Mount the VoiceGuard API under /api — all backend routes become /api/...
app.mount("/api", api_app)

# Serve the React SPA when a frontend build is available.
if FRONTEND_DIST is not None:
    # Serve /assets/* directly so hashed JS/CSS bundles load correctly.
    _assets_dir = FRONTEND_DIST / "assets"
    if _assets_dir.is_dir():
        app.mount("/assets", StaticFiles(directory=str(_assets_dir)), name="assets")

    # Catch-all: serve static files if they exist, otherwise return index.html
    # so React Router's client-side routes work.
    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_spa(request: Request, full_path: str):
        """Serve frontend SPA — static files or index.html fallback."""
        if full_path:
            file_path = FRONTEND_DIST / full_path
            if file_path.is_file():
                return FileResponse(file_path)
        return FileResponse(FRONTEND_DIST / "index.html")
else:
    @app.get("/", include_in_schema=False)
    async def root():
        return {
            "name": "VoiceGuard API",
            "status": "running",
            "docs": "/api/docs",
            "health": "/api/health",
            "note": "Frontend not found. API is available under /api/.",
        }
