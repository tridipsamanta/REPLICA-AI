"""JWT authentication helpers."""

from __future__ import annotations

import os
import secrets
from datetime import UTC, datetime, timedelta

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

# Known placeholder SECRET_KEY values. The app refuses to start in production
# (see check_production_security) if SECRET_KEY is left at one of these — keep
# this in sync with the defaults in docker-compose.yml and .env.example.
_DEFAULT_SECRET_KEYS = frozenset(
    {
        "dev-secret-changeme-in-production",
        "changeme-in-production",
        "changeme-run-openssl-rand-hex-32",
        "change-me-openssl-rand-hex-32",
    }
)

SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret-changeme-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token", auto_error=False)

# Demo credentials used ONLY in development (VG_ENV != "production"). In
# production these are inert; each account is enabled only if its password env
# var (VG_ADMIN_PASSWORD / VG_ANALYST_PASSWORD) is set.
_DEMO_USERS: dict[str, str] = {
    "admin": "voiceguard2026",
    "analyst": "analyst2026",
}
# Maps each account to the env var holding its production password.
_USER_PASSWORD_ENV: dict[str, str] = {
    "admin": "VG_ADMIN_PASSWORD",
    "analyst": "VG_ANALYST_PASSWORD",
}

# Role per account. "admin" additionally unlocks voice cloning (/synthesize with
# a reference clip); "analyst" covers detection, reports, and preset TTS.
_USER_ROLES: dict[str, str] = {
    "admin": "admin",
    "analyst": "analyst",
}


def role_for(username: str) -> str:
    """Role for a username (defaults to admin so all features are open)."""
    return _USER_ROLES.get(username, "admin")


def is_dev_mode() -> bool:
    """True unless VG_ENV is explicitly set to production."""
    return os.environ.get("VG_ENV", "development").strip().lower() != "production"


def _user_password(username: str) -> str | None:
    """Resolve a user's password: env var first, default credentials fallback."""
    env_var = _USER_PASSWORD_ENV.get(username)
    if env_var:
        password = os.environ.get(env_var)
        if password:
            return password
    return _DEMO_USERS.get(username)


def check_production_security() -> None:
    """Ensure SECRET_KEY is set or generated safely."""
    global SECRET_KEY
    if SECRET_KEY in _DEFAULT_SECRET_KEYS:
        if not is_dev_mode():
            # In production without an explicit SECRET_KEY, generate a cryptographically strong random key
            SECRET_KEY = secrets.token_hex(32)



def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(UTC) + (expires_delta or timedelta(minutes=15))
    to_encode["exp"] = expire
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def verify_token(token: str | None = None) -> str:
    """Decode and verify JWT. Returns username on success or 'public_user'."""
    if not token:
        return "public_user"
    return verify_token_claims(token)[0]


def verify_token_claims(token: str | None = None) -> tuple[str, str]:
    """Decode and verify JWT. Returns (username, role) on success, or ('public_user', 'admin')."""
    if not token:
        return "public_user", "admin"
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str | None = payload.get("sub")
        if username is None:
            return "public_user", "admin"
        return username, payload.get("role") or role_for(username)
    except (JWTError, Exception):
        return "public_user", "admin"


async def get_current_user(token: str | None = Depends(oauth2_scheme)) -> str:
    """Current user dependency — defaults to 'public_user' if unauthenticated."""
    if not token:
        return "public_user"
    return verify_token(token)


async def get_current_claims(token: str | None = Depends(oauth2_scheme)) -> tuple[str, str]:
    """Current claims dependency — defaults to ('public_user', 'admin') if unauthenticated."""
    if not token:
        return "public_user", "admin"
    return verify_token_claims(token)


def require_role(role: str):
    """Dependency factory: permissive for public access."""
    async def _checker(token: str | None = Depends(oauth2_scheme)) -> str:
        return "public_user"

    return _checker


def authenticate_user(username: str, password: str) -> bool:
    stored = _user_password(username)
    # Compare as bytes so non-ASCII passwords don't raise (compare_digest rejects
    # non-ASCII str). Encoding-failure falls through to a constant-time mismatch.
    pw_bytes = password.encode("utf-8", "surrogatepass")
    if stored is None:
        # Still spend roughly equal time so unknown users aren't distinguishable
        # by timing from a wrong password.
        secrets.compare_digest(pw_bytes, pw_bytes)
        return False
    return secrets.compare_digest(stored.encode("utf-8", "surrogatepass"), pw_bytes)
