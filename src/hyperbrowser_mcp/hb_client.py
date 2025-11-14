from __future__ import annotations

from contextlib import asynccontextmanager
from typing import AsyncIterator, Callable, Protocol

from hyperbrowser import AsyncHyperbrowser


class SupportsAsyncClose(Protocol):
    async def close(self) -> None: ...


class HyperbrowserClientFactory:
    """Creates scoped AsyncHyperbrowser clients with the correct API key."""

    def __init__(
        self,
        default_api_key: str | None,
        client_ctor: Callable[[str], SupportsAsyncClose] | None = None,
    ):
        self._default_api_key = default_api_key
        self._client_ctor = client_ctor or AsyncHyperbrowser

    @asynccontextmanager
    async def client(self, api_key: str | None) -> AsyncIterator[SupportsAsyncClose]:
        key = api_key or self._default_api_key
        if not key:
            raise ValueError("No Hyperbrowser API key provided. Supply one via auth or env.")

        client = self._client_ctor(key)
        try:
            yield client
        finally:
            await client.close()
