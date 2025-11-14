from __future__ import annotations

from mcp.server.fastmcp.server import FastMCP

from .config import Settings
from .hb_client import HyperbrowserClientFactory
from .models import (
    BrowserTaskParams,
    BrowserTaskResult,
    CrawlSiteParams,
    CrawlSiteResult,
    ExtractStructuredParams,
    ExtractStructuredResult,
    ScrapePageParams,
    ScrapePageResult,
)
from .service import HyperbrowserService


def register_tools(server: FastMCP, settings: Settings) -> None:
    factory = HyperbrowserClientFactory(default_api_key=settings.hb_api_key)
    service = HyperbrowserService(factory)

    @server.tool(
        name="scrape_page",
        description="Scrape a single page with sensible defaults. Formats limited to markdown/html/screenshot.",
        structured_output=True,
    )
    async def scrape_page_tool(params: ScrapePageParams) -> ScrapePageResult:
        context = server.get_context()
        return await service.scrape_page(params, context)

    @server.tool(
        name="crawl_site",
        description="Lightweight crawler that summarizes up to 25 pages.",
        structured_output=True,
    )
    async def crawl_site_tool(params: CrawlSiteParams) -> CrawlSiteResult:
        context = server.get_context()
        return await service.crawl_site(params, context)

    @server.tool(
        name="extract_structured",
        description="Extract structured data from a page given an intent prompt and optional JSON schema.",
        structured_output=True,
    )
    async def extract_structured_tool(params: ExtractStructuredParams) -> ExtractStructuredResult:
        context = server.get_context()
        return await service.extract_structured(params, context)

    @server.tool(
        name="browser_task",
        description="Autonomous browser task with smart agent selection (Browser Use, CUA, Claude).",
        structured_output=True,
    )
    async def browser_task_tool(params: BrowserTaskParams) -> BrowserTaskResult:
        context = server.get_context()
        return await service.run_browser_task(params, context)

