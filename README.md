# Hyperbrowser MCP Server (Python)

A fully server-side Model Context Protocol (MCP) implementation for Hyperbrowser. The server exposes a curated set of tools over SSE transport, handles authentication with Hyperbrowser API keys, and makes smart choices about browser automation settings so you don't have to.

## Features

- **SSE-only transport** built on top of `mcp`'s `FastMCP` utilities. Run it anywhere you can host a Starlette/ASGI app.
- **Secure by default**: every call requires a valid Hyperbrowser API key (`Bearer <key>`) that is verified against `https://app.hyperbrowser.ai/api/me`.
- **Opinionated tools** with minimal parameters:
  - `scrape_page` – single-page scrape with Markdown/HTML/screenshots.
  - `crawl_site` – lightweight crawler (defaults to 5 pages, main content only).
  - `extract_structured` – schema-aware extraction with optional auto-schema generation.
  - `browser_task` – routes your natural-language task to Browser Use, OpenAI CUA, or Claude Computer Use depending on complexity.
- **No resources**: the server focuses entirely on live tooling.
- **Python-first**: structured settings via `pydantic-settings`, logging with `structlog`, and a test suite built with `pytest`/`respx`.

The tool behaviors are based on the Hyperbrowser Python SDK examples in the docs MCP server (`AsyncHyperbrowser.start_and_wait` for scrape/crawl/extract). Those snippets outline the same workflow implemented here.

## Quick Start

```bash
git clone https://github.com/hyperbrowserai/mcp.git hyperbrowser-mcp
cd hyperbrowser-mcp
pip install .[dev]
HYPERBROWSER_API_KEY=hb_live_123 uvicorn hyperbrowser_mcp.server:app --host 0.0.0.0 --port 8000
```

The server automatically exposes:

- `GET /sse` – Server-Sent Events stream
- `POST /messages/` – client-to-server JSON-RPC messages (MCP standard)

Provide your Hyperbrowser API key via the Authorization header:

```
Authorization: Bearer hb_live_...
```

> **Note**: When running in Cursor, Windsurf, or any MCP-aware client, configure the server as an SSE transport pointing at the `/sse` endpoint with the same bearer token.

## Configuration

Environment variables (see `hyperbrowser_mcp/config.py` for the full list):

| Variable | Default | Description |
| --- | --- | --- |
| `HYPERBROWSER_API_KEY` | — | Optional fallback key for stdio tools or internal automation. SSE clients should pass their own keys. |
| `MCP_HOST` | `0.0.0.0` | Bind address when using the packaged CLI (`hyperbrowser-mcp serve`). |
| `MCP_PORT` | `8000` | Port for the SSE server. |
| `HYPERBROWSER_AUTH_ISSUER` | `https://app.hyperbrowser.ai` | OAuth issuer URL used in auth metadata. |
| `HYPERBROWSER_RESOURCE_URL` | `https://hyperbrowser-mcp.hyperbrowser.ai` | Resource server URL advertised in auth metadata. |
| `HB_AUTH_CACHE_SECONDS` | `300` | API-key validation cache duration. |

## Developing

Common tasks are wrapped in the Makefile:

```bash
make install   # pip install .[dev]
make lint      # ruff + mypy
make test      # pytest with coverage
make serve     # run uvicorn hyperbrowser_mcp.server:app
```

The tests rely on `respx` to stub Hyperbrowser HTTP calls and never touch the live service.

## Deploying

1. Build the image:

   ```bash
   docker build -t hyperbrowser-mcp .
   ```

2. Run it:

   ```bash
   docker run --rm -p 8000:8000 -e HYPERBROWSER_API_KEY=hb_live_123 hyperbrowser-mcp
   ```

3. Point your MCP client at `http://localhost:8000/sse` with `Authorization: Bearer hb_live_123`.

## License

MIT © Hyperbrowser.
