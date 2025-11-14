from __future__ import annotations

import time
from typing import Any

import httpx
from mcp.server.auth.provider import AccessToken, TokenVerifier
from structlog import get_logger

from .config import Settings

LOGGER = get_logger(__name__)


class HyperbrowserTokenVerifier(TokenVerifier):
    """Validates Hyperbrowser API keys against the dashboard API."""

    def __init__(self, settings: Settings):
        self._settings = settings
        self._client = httpx.AsyncClient(timeout=settings.request_timeout_seconds)
        self._cache: dict[str, tuple[float, AccessToken]] = {}

    async def verify_token(self, token: str) -> AccessToken | None:
        cached = self._cache.get(token)
        if cached and (time.monotonic() - cached[0] < self._settings.cache_ttl_seconds):
            return cached[1]

        headers: dict[str, Any] = {"x-api-key": token}
        response = await self._client.get("https://app.hyperbrowser.ai/api/me", headers=headers)

        if response.is_success:
            access = AccessToken(
                token=token,
                client_id="hyperbrowser-mcp",
                scopes=["mcp:tools"],
            )
            self._cache[token] = (time.monotonic(), access)
            return access

        LOGGER.warning("API key validation failed", status=response.status_code)
        return None

    async def aclose(self) -> None:
        await self._client.aclose()
