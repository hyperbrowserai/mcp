from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field, HttpUrl


class ScrapePageParams(BaseModel):
    url: HttpUrl
    format: Literal["markdown", "html", "screenshot"] = "markdown"
    include_links: bool = False


class ScrapePageResult(BaseModel):
    markdown: str | None = None
    html: str | None = None
    links: list[str] | None = None
    screenshot_url: str | None = None


class CrawlSiteParams(BaseModel):
    url: HttpUrl
    max_pages: int = Field(default=5, ge=1, le=25)
    include_links: bool = True
    include_markdown: bool = True


class CrawlSiteResult(BaseModel):
    pages: list[dict[str, Any]]


class ExtractStructuredParams(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    url: HttpUrl
    prompt: str = Field(min_length=4)
    schema_definition: dict[str, Any] | None = Field(default=None, alias="schema")
    max_links: int = Field(default=0, ge=0, le=10)


class ExtractStructuredResult(BaseModel):
    data: Any


class BrowserTaskParams(BaseModel):
    task: str = Field(min_length=8)
    strategy: Literal["auto", "fast", "balanced", "reasoning"] = "auto"
    max_steps: int = Field(default=25, ge=1, le=100)
    return_steps: bool = False


class BrowserTaskResult(BaseModel):
    final_result: str | None = None
    steps: list[dict[str, Any]] | None = None
