import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  oaiCuaTool,
  oaiCuaToolDescription,
  oaiCuaToolName,
} from "../tools/oai-cua";
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
  bingSearchToolParamSchemaRaw,
  browserUseToolParamSchemaRaw,
  claudeComputerUseToolParamSchemaRaw,
  crawlWebpagesToolParamSchemaRaw,
  extractStructuredDataToolParamSchemaRaw,
  oaiCuaToolParamSchemaRaw,
  scrapeWebpageToolParamSchemaRaw,
} from "../tools/tool-types";
import {
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import {
  listAllResources,
  getResource,
} from "../resources/static/get_resources";
import {
  claudeComputerUseTool,
  claudeComputerUseToolDescription,
  claudeComputerUseToolName,
} from "../tools/claude-computer-use";
import {
  bingSearchTool,
  bingSearchToolDescription,
  bingSearchToolName,
} from "../tools/bing-search";
// Import new profile tools
import {
  createProfileTool,
  createProfileToolDescription,
  createProfileToolName,
} from "../tools/create-profile";
import {
  deleteProfileTool,
  deleteProfileToolDescription,
  deleteProfileToolName,
} from "../tools/delete-profile";
import {
  listProfilesTool,
  listProfilesToolDescription,
  listProfilesToolName,
} from "../tools/list-profiles";
// Import new profile tool schemas (create schema is empty object)
import {
  deleteProfileToolParamSchemaRaw,
  listProfilesToolParamSchemaRaw,
} from "../tools/tool-types";


function setupServer(server: McpServer) {
  // Existing tools
  server.tool(
    scrapeWebpageToolName,
    scrapeWebpageToolDescription,
    scrapeWebpageToolParamSchemaRaw,
    {
      title: "Scrape Webpage",
      readOnlyHint: true,
      openWorldHint: true,
    },
    scrapeWebpageTool
  );
  server.tool(
    crawlWebpagesToolName,
    crawlWebpagesToolDescription,
    crawlWebpagesToolParamSchemaRaw,
    {
      title: "Crawl Webpages",
      readOnlyHint: true,
      openWorldHint: true,
    },
    crawlWebpagesTool
  );
  server.tool(
    extractStructuredDataToolName,
    extractStructuredDataToolDescription,
    extractStructuredDataToolParamSchemaRaw,
    {
      title: "Extract Structured Data",
      readOnlyHint: true,
      openWorldHint: true,
    },
    extractStructuredDataTool
  );
  server.tool(
    browserUseToolName,
    browserUseToolDescription,
    browserUseToolParamSchemaRaw,
    {
      title: "Browser Use Agent",
      destructiveHint: true,
      openWorldHint: true,
    },
    browserUseTool
  );
  server.tool(
    oaiCuaToolName,
    oaiCuaToolDescription,
    oaiCuaToolParamSchemaRaw,
    {
      title: "OpenAI Computer Use Agent",
      destructiveHint: true,
      openWorldHint: true,
    },
    oaiCuaTool
  );

  server.tool(
    claudeComputerUseToolName,
    claudeComputerUseToolDescription,
    claudeComputerUseToolParamSchemaRaw,
    {
      title: "Claude Computer Use Agent",
      destructiveHint: true,
      openWorldHint: true,
    },
    claudeComputerUseTool
  );

  server.tool(
    bingSearchToolName,
    bingSearchToolDescription,
    bingSearchToolParamSchemaRaw,
    {
      title: "Search with Bing",
      readOnlyHint: true,
      openWorldHint: true,
    },
    bingSearchTool
  );

  // Register new profile tools
  server.tool(
    createProfileToolName,
    createProfileToolDescription,
    {}, // createProfileToolParamSchemaRaw is just an empty object
    {
      title: "Create Profile",
      destructiveHint: false,
    },
    createProfileTool
  );
  server.tool(
    deleteProfileToolName,
    deleteProfileToolDescription,
    deleteProfileToolParamSchemaRaw,
    {
      title: "Delete Profile",
      destructiveHint: true,
    },
    deleteProfileTool
  );
  server.tool(
    listProfilesToolName,
    listProfilesToolDescription,
    listProfilesToolParamSchemaRaw,
    {
      title: "List Profiles",
      readOnlyHint: true,
    },
    listProfilesTool
  );


  server.server.setRequestHandler(ListResourcesRequestSchema, listAllResources);
  server.server.setRequestHandler(ReadResourceRequestSchema, getResource);
}

export default setupServer;
