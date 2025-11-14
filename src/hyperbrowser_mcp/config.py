from __future__ import annotations

from functools import lru_cache

from pydantic import AnyHttpUrl, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Process-wide configuration."""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="allow")

    hb_api_key: str | None = Field(default=None, alias="HYPERBROWSER_API_KEY")
    host: str = Field(default="0.0.0.0", alias="MCP_HOST")
    port: int = Field(default=8000, alias="MCP_PORT")
    log_level: str = Field(default="INFO")
    sse_path: str = "/sse"
    messages_path: str = "/messages/"
    cache_ttl_seconds: int = Field(default=300, alias="HB_AUTH_CACHE_SECONDS")
    request_timeout_seconds: int = 30
    auth_issuer_url: AnyHttpUrl = Field(default="https://app.hyperbrowser.ai", alias="HYPERBROWSER_AUTH_ISSUER")
    resource_server_url: AnyHttpUrl = Field(
        default="https://hyperbrowser-mcp.hyperbrowser.ai", alias="HYPERBROWSER_RESOURCE_URL"
    )
    instructions: str = (
        "Secure Hyperbrowser automation server with curated tools for scraping, crawling, "
        "structured extraction, and autonomous browser tasks."
    )


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()

