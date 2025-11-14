from __future__ import annotations

from types import SimpleNamespace
from typing import Any

import pytest
from mcp.server.fastmcp.server import Context

from hyperbrowser_mcp.hb_client import HyperbrowserClientFactory
from hyperbrowser_mcp.models import BrowserTaskParams, CrawlSiteParams, ScrapePageParams
from hyperbrowser_mcp.service import HyperbrowserService, _crawl_formats


class _ScrapeStub:
    async def start_and_wait(self, params):
        self.params = params
        return SimpleNamespace(data={"markdown": "# hello"}, error=None)


class _CrawlStub:
    async def start_and_wait(self, params):
        self.params = params
        return SimpleNamespace(
            data=[
                {"url": "https://example.com", "status": "completed", "markdown": "body", "links": ["https://a"]}
            ]
        )


class _AgentsStub:
    def __init__(self):
        self.browser_use = SimpleNamespace(start_and_wait=self._return_payload)
        self.cua = SimpleNamespace(start_and_wait=self._return_payload)
        self.claude_computer_use = SimpleNamespace(start_and_wait=self._return_payload)

    async def _return_payload(self, params):
        self.params = params
        return SimpleNamespace(data={"finalResult": "done", "steps": [{"action": "click"}]})


class _ClientStub:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.scrape = _ScrapeStub()
        self.crawl = _CrawlStub()
        self.agents = _AgentsStub()

    async def close(self) -> None:
        return None


def _factory(api_key: str) -> _ClientStub:
    return _ClientStub(api_key)


def _service() -> HyperbrowserService:
    factory = HyperbrowserClientFactory(default_api_key="env-key", client_ctor=_factory)
    return HyperbrowserService(factory)


class _Token(SimpleNamespace):
    token: str


def _context() -> Context:
    return Context()  # type: ignore[arg-type]


@pytest.mark.asyncio
async def test_scrape_page_uses_request_token(monkeypatch):
    monkeypatch.setattr("hyperbrowser_mcp.service.get_access_token", lambda: _Token(token="user-key"))
    service = _service()
    result = await service.scrape_page(
        ScrapePageParams(url="https://example.com", format="markdown"), context=_context()
    )
    assert result.markdown == "# hello"


@pytest.mark.asyncio
async def test_crawl_site_includes_links(monkeypatch):
    monkeypatch.setattr("hyperbrowser_mcp.service.get_access_token", lambda: None)
    service = _service()
    result = await service.crawl_site(
        CrawlSiteParams(url="https://example.com", include_links=True), context=_context()
    )
    assert result.pages[0]["links"] == ["https://a"]


def test_crawl_formats_default():
    params = CrawlSiteParams(url="https://example.com")
    assert _crawl_formats(params) == ["markdown", "links"]


@pytest.mark.asyncio
async def test_browser_task_returns_steps(monkeypatch):
    monkeypatch.setattr("hyperbrowser_mcp.service.get_access_token", lambda: _Token(token="task-key"))
    service = _service()
    result = await service.run_browser_task(
        BrowserTaskParams(task="perform an in-depth reasoning task", return_steps=True, strategy="reasoning"),
        context=_context(),
    )
    assert result.steps and result.final_result == "done"
