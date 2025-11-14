from __future__ import annotations

from contextlib import asynccontextmanager

from mcp.server import FastMCP
from mcp.server.auth.settings import AuthSettings
from mcp.server.transport_security import TransportSecuritySettings

from .auth import HyperbrowserTokenVerifier
from .config import Settings, get_settings
from .logging_config import configure_logging
from .tools import register_tools

settings = get_settings()
configure_logging(settings.log_level)
token_verifier = HyperbrowserTokenVerifier(settings)


@asynccontextmanager
async def server_lifespan(_: FastMCP):
    try:
        yield
    finally:
        await token_verifier.aclose()


server = FastMCP(
    name="hyperbrowser",
    instructions=settings.instructions,
    lifespan=server_lifespan,
    auth=AuthSettings(
        issuer_url=settings.auth_issuer_url,
        resource_server_url=settings.resource_server_url,
        required_scopes=["mcp:tools"],
    ),
    token_verifier=token_verifier,
    transport_security=TransportSecuritySettings(enforce_host_header=True),
    sse_path=settings.sse_path,
    message_path=settings.messages_path,
)

register_tools(server, settings)

app = server.sse_app()
