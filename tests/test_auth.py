import pytest
import respx
from httpx import Response

from hyperbrowser_mcp.auth import HyperbrowserTokenVerifier
from hyperbrowser_mcp.config import Settings


@pytest.mark.asyncio
async def test_token_verifier_caches_success():
    settings = Settings()
    verifier = HyperbrowserTokenVerifier(settings)

    with respx.mock(assert_all_mocked=True) as mock:
        route = mock.get("https://app.hyperbrowser.ai/api/me").mock(
            return_value=Response(200, json={"id": "abc"})
        )
        access = await verifier.verify_token("live-key")
        assert access and access.token == "live-key"
        assert route.called

        # Cached result should avoid extra network calls
        access_cached = await verifier.verify_token("live-key")
        assert access_cached and route.call_count == 1

    await verifier.aclose()


@pytest.mark.asyncio
async def test_token_verifier_rejects_invalid_key():
    settings = Settings()
    verifier = HyperbrowserTokenVerifier(settings)

    with respx.mock(assert_all_mocked=True) as mock:
        mock.get("https://app.hyperbrowser.ai/api/me").mock(return_value=Response(403))
        assert await verifier.verify_token("bad-key") is None

    await verifier.aclose()
