import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import {
  browserUseTool,
  browserUseToolDescription,
  browserUseToolName,
} from "../tools/browser-use";
import {
  crawlWebpagesTool,
  crawlWebpagesToolDescription,
  crawlWebpagesToolName,
} from "../tools/crawl-webpages";
import {
  extractStructuredDataTool,
  extractStructuredDataToolDescription,
  extractStructuredDataToolName,
} from "../tools/extract-structured";
import {
  scrapeWebpageTool,
  scrapeWebpageToolDescription,
  scrapeWebpageToolName,
} from "../tools/scrape-webpage";
import {
  browserUseToolParamSchemaRaw,
  crawlWebpagesToolParamSchemaRaw,
  extractStructuredDataToolParamSchemaRaw,
  scrapeWebpageToolParamSchemaRaw,
} from "../tools/tool-types";

function setupServer(server: McpServer) {
  server.tool(
    scrapeWebpageToolName,
    scrapeWebpageToolDescription,
    scrapeWebpageToolParamSchemaRaw,
    scrapeWebpageTool
  );
  server.tool(
    crawlWebpagesToolName,
    crawlWebpagesToolDescription,
    crawlWebpagesToolParamSchemaRaw,
    crawlWebpagesTool
  );
  server.tool(
    extractStructuredDataToolName,
    extractStructuredDataToolDescription,
    extractStructuredDataToolParamSchemaRaw,
    extractStructuredDataTool
  );
  server.tool(
    browserUseToolName,
    browserUseToolDescription,
    browserUseToolParamSchemaRaw,
    browserUseTool
  );

  server.tool("test", async () => {
    await new Promise((resolve) => setTimeout(resolve, 10_000));
    return {
      content: [{ type: "text", text: "Hello, world!" }],
    };
  });
}

export default setupServer;
