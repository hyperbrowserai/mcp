from __future__ import annotations

from typing import Any, Literal

from hyperbrowser.exceptions import HyperbrowserError
from hyperbrowser.models.agents.browser_use import StartBrowserUseTaskParams
from hyperbrowser.models.agents.claude_computer_use import StartClaudeComputerUseTaskParams
from hyperbrowser.models.agents.cua import StartCuaTaskParams
from hyperbrowser.models.crawl import StartCrawlJobParams
from hyperbrowser.models.extract import StartExtractJobParams
from hyperbrowser.models.scrape import ScrapeOptions, StartScrapeJobParams
from mcp.server.fastmcp.server import Context
from mcp.server.auth.middleware.auth_context import get_access_token
from structlog import get_logger

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

LOGGER = get_logger(__name__)


class HyperbrowserService:
    def __init__(self, client_factory: HyperbrowserClientFactory):
        self._clients = client_factory

    async def scrape_page(self, params: ScrapePageParams, context: Context) -> ScrapePageResult:
        api_key = _resolve_api_key(context)
        formats: list[str] = [params.format]
        if params.include_links:
            formats.append("links")

        scrape_options = ScrapeOptions(formats=formats, only_main_content=True)
        job_params = StartScrapeJobParams(url=str(params.url), scrape_options=scrape_options)

        async with self._clients.client(api_key) as client:
            response = await client.scrape.start_and_wait(job_params)

        data = response.data or {}
        return ScrapePageResult(
            markdown=data.get("markdown"),
            html=data.get("html"),
            links=data.get("links"),
            screenshot_url=data.get("screenshot"),
        )

    async def crawl_site(self, params: CrawlSiteParams, context: Context) -> CrawlSiteResult:
        api_key = _resolve_api_key(context)
        crawl_params = StartCrawlJobParams(
            url=str(params.url),
            max_pages=params.max_pages,
            follow_links=True,
            scrape_options=ScrapeOptions(
                formats=_crawl_formats(params),
                only_main_content=True,
            ),
        )

        async with self._clients.client(api_key) as client:
            response = await client.crawl.start_and_wait(crawl_params)

        pages: list[dict[str, Any]] = []
        for page in response.data or []:
            entry: dict[str, Any] = {"url": page.get("url"), "status": page.get("status")}
            if params.include_markdown:
                entry["markdown"] = page.get("markdown")
            if params.include_links:
                entry["links"] = page.get("links")
            pages.append(entry)
        return CrawlSiteResult(pages=pages)

    async def extract_structured(
        self,
        params: ExtractStructuredParams,
        context: Context,
    ) -> ExtractStructuredResult:
        api_key = _resolve_api_key(context)
        job_params = StartExtractJobParams(
            urls=[str(params.url)],
            prompt=params.prompt,
            max_links=params.max_links or 0,
            schema_=params.schema_definition or {"type": "object"},
        )

        async with self._clients.client(api_key) as client:
            response = await client.extract.start_and_wait(job_params)

        if response.error:
            raise HyperbrowserError(response.error)

        return ExtractStructuredResult(data=response.data)

    async def run_browser_task(
        self,
        params: BrowserTaskParams,
        context: Context,
    ) -> BrowserTaskResult:
        api_key = _resolve_api_key(context)
        agent = _pick_agent(params.strategy, params.task)

        async with self._clients.client(api_key) as client:
            if agent == "browser_use":
                task_params = StartBrowserUseTaskParams(task=params.task, max_steps=params.max_steps)
                result = await client.agents.browser_use.start_and_wait(task_params)
                payload = result.data or {}
            elif agent == "cua":
                task_params = StartCuaTaskParams(task=params.task, max_steps=params.max_steps)
                result = await client.agents.cua.start_and_wait(task_params)
                payload = result.data or {}
            else:
                task_params = StartClaudeComputerUseTaskParams(task=params.task, max_steps=params.max_steps)
                result = await client.agents.claude_computer_use.start_and_wait(task_params)
                payload = result.data or {}

        steps = payload.get("steps") if params.return_steps else []
        return BrowserTaskResult(final_result=payload.get("finalResult") or payload.get("final_result"), steps=steps)


def _resolve_api_key(context: Context) -> str | None:
    token = get_access_token()
    if token:
        return token.token
    session_identifier = None
    try:
        session = getattr(context, "session", None)
        if session is not None:
            session_identifier = getattr(session, "request_id", None)
    except ValueError:
        session_identifier = None
    LOGGER.debug("Falling back to default API key", session=session_identifier)
    return None


def _pick_agent(strategy: Literal["auto", "fast", "balanced", "reasoning"], task: str) -> str:
    if strategy == "fast":
        return "browser_use"
    if strategy == "balanced":
        return "cua"
    if strategy == "reasoning":
        return "claude"
    lowered = task.lower()
    if any(keyword in lowered for keyword in ["pilot", "precise", "form"]):
        return "browser_use"
    if any(keyword in lowered for keyword in ["multi-step", "workflow", "analyze"]):
        return "cua"
    return "claude" if "reason" in lowered or "research" in lowered else "browser_use"


def _crawl_formats(params: CrawlSiteParams) -> list[str]:
    formats: list[str] = []
    if params.include_markdown:
        formats.append("markdown")
    if params.include_links:
        formats.append("links")
    return formats or ["markdown"]
