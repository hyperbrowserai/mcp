from __future__ import annotations

import typer
import uvicorn

from .config import get_settings

cli = typer.Typer(help="Hyperbrowser MCP SSE server")


@cli.command()
def serve(
    host: str | None = typer.Option(None, "--host", help="Bind address override."),
    port: int | None = typer.Option(None, "--port", help="Port override."),
):
    """Start the SSE server."""
    settings = get_settings()
    uvicorn.run(
        "hyperbrowser_mcp.server:app",
        host=host or settings.host,
        port=port or settings.port,
        log_level=settings.log_level.lower(),
        reload=False,
    )


def main() -> None:
    cli()


if __name__ == "__main__":
    main()
