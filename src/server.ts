import { z } from "zod";
import { Ajv } from "ajv";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

import { downloadImageAsBase64, getClient, logWithTimestamp } from "./utils.js";

const ajv = new Ajv({
  coerceTypes: true,
  useDefaults: true,
});

// Create server instance
const server = new McpServer({
  name: "hyperbrowser",
  version: "1.0.0",
});

const sessionOptionsSchema = z
  .object({
    useProxy: z.boolean().default(false).describe("Whether to use a proxy"),
    useStealth: z.boolean().default(false).describe("Whether to use stealth mode."),
    solveCaptchas: z.boolean().default(false).describe("Whether to solve captchas."),
    acceptCookies: z
      .boolean()
      .default(false)
      .describe("Whether to automatically close the accept cookies popup"),
  })
  .optional()
  .describe(
    "Options for the browser session. Avoid setting these if not mentioned explicitly"
  );

const apiKeySchema = z
  .string()
  .optional()
  .describe("The API key to use for the scrape");

// Register hyperbrowser tools
server.tool(
  "scrape_webpage",
  "Scrape a webpage and extract its content in various formats. This tool allows fetching content from a single URL with configurable browser behavior options. Use this for extracting text content, HTML structure, collecting links, or capturing screenshots of webpages.",
  {
    url: z.string().url().describe("The URL of the webpage to scrape"),
    apiKey: apiKeySchema,
    sessionOptions: sessionOptionsSchema,
    outputFormat: z
      .array(z.enum(["markdown", "html", "links", "screenshot"]))
      .min(1)
      .describe("The format of the output"),
  },
  async ({
    url,
    apiKey,
    sessionOptions,
    outputFormat,
  }): Promise<CallToolResult> => {
    const currentApiKey = apiKey ?? process.env.HB_API_KEY;
    if (!currentApiKey) {
      return {
        content: [
          {
            type: "text",
            text: "No API key provided or found in environment variables",
          },
        ],
        isError: true,
      };
    }
    const client = await getClient(currentApiKey);

    const result = await client.scrape.startAndWait({
      url,
      sessionOptions,
      scrapeOptions: {
        formats: outputFormat,
      },
    });

    if (result.error) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: result.error,
          },
        ],
      };
    }

    const response: CallToolResult = {
      content: [],
      isError: false,
    };

    if (result.data?.markdown) {
      response.content.push({
        type: "text",
        text: result.data.markdown,
      });
    }

    if (result.data?.html) {
      response.content.push({
        type: "text",
        text: result.data.html,
      });
    }

    if (result.data?.links) {
      result.data.links.forEach((link) => {
        response.content.push({
          type: "resource",
          resource: {
            uri: link,
            text: link,
          },
        });
      });
    }

    if (result.data?.screenshot) {
      const imageData = await downloadImageAsBase64(result.data.screenshot);
      if (!imageData) {
        response.content.push({
          type: "text",
          text: "Failed to get screenshot",
        });
        response.isError = true;
      } else {
        response.content.push({
          type: "image",
          data: imageData.data,
          mimeType: imageData.mimeType,
        });
      }
    }

    return response;
  }
);

server.tool(
  "extract_structured_data",
  "Extract structured data from one or more webpages according to a specified schema. This tool parses webpage content and returns JSON-formatted data based on your prompt instructions. Ideal for extracting product information, article metadata, contact details, or any structured content from websites.",
  {
    urls: z
      .array(z.string().url())
      .describe(
        "The list of URLs of the webpages to extract structured information from. Can include wildcards (e.g. https://example.com/*)"
      ),
    apiKey: apiKeySchema,
    prompt: z.string().describe("The prompt to use for the extraction"),
    schema: z
      .any({})
      .transform((schema) => {
        if (!schema) {
          return false;
        } else {
          try {
            if (typeof schema === "string") {
              try {
                const parsedSchema = JSON.parse(schema);
                const validate = ajv.compile(parsedSchema);
                if (typeof validate === "function") {
                  return parsedSchema;
                } else {
                  return undefined;
                }
              } catch (err) {
                return undefined;
              }
            } else {
              const validate = ajv.compile(schema);
              if (typeof validate === "function") {
                return schema;
              } else {
                return undefined;
              }
            }
          } catch (err) {
            return false;
          }
        }
      })
      .describe(
        "The json schema to use for the extraction. Must provide an object describing a spec compliant json schema, any other types are invalid."
      ),
    sessionOptions: sessionOptionsSchema,
  },
  async ({
    urls,
    apiKey,
    sessionOptions,
    prompt,
    schema,
  }): Promise<CallToolResult> => {
    const currentApiKey = apiKey ?? process.env.HB_API_KEY;
    if (!currentApiKey) {
      return {
        content: [
          {
            type: "text",
            text: "No API key provided or found in environment variables",
          },
        ],
        isError: true,
      };
    }
    const client = await getClient(currentApiKey);

    const params = {
      urls,
      sessionOptions,
      prompt,
      schema,
    };

    const result = await client.extract.startAndWait(params);

    if (result.error) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: result.error,
          },
        ],
      };
    }

    const response: CallToolResult = {
      content: [
        {
          type: "text",
          text: JSON.stringify(result.data, null, 2),
        },
      ],
      isError: false,
    };

    return response;
  }
);

server.tool(
  "crawl_webpages",
  "Crawl a website starting from a URL and explore linked pages. This tool allows systematic collection of content from multiple pages within a domain. Use this for larger data collection tasks, content indexing, or site mapping.",
  {
    url: z.string().url().describe("The URL of the webpage to crawl."),
    apiKey: apiKeySchema,
    sessionOptions: sessionOptionsSchema,
    outputFormat: z
      .array(z.enum(["markdown", "html", "links", "screenshot"]))
      .min(1)
      .describe("The format of the output"),
    followLinks: z
      .boolean()
      .describe("Whether to follow links on the crawled webpages"),
    maxPages: z
      .number()
      .int()
      .positive()
      .finite()
      .safe()
      .min(1)
      .max(1000)
      .default(10),
    ignoreSitemap: z.boolean().default(false),
  },
  async ({
    url,
    apiKey,
    sessionOptions,
    outputFormat,
    ignoreSitemap,
    followLinks,
    maxPages,
  }): Promise<CallToolResult> => {
    const currentApiKey = apiKey ?? process.env.HB_API_KEY;
    if (!currentApiKey) {
      return {
        content: [
          {
            type: "text",
            text: "No API key provided or found in environment variables",
          },
        ],
        isError: true,
      };
    }
    const client = await getClient(currentApiKey);

    const result = await client.crawl.startAndWait({
      url,
      sessionOptions,
      scrapeOptions: {
        formats: outputFormat,
      },
      maxPages,
      ignoreSitemap,
      followLinks,
    });

    if (result.error) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: result.error,
          },
        ],
      };
    }

    const response: CallToolResult = {
      content: [],
      isError: false,
    };

    result.data?.forEach((page) => {
      if (page?.markdown) {
        response.content.push({
          type: "text",
          text: page.markdown,
        });
      }

      if (page?.html) {
        response.content.push({
          type: "text",
          text: page.html,
        });
      }

      if (page?.links) {
        page.links.forEach((link) => {
          response.content.push({
            type: "resource",
            resource: {
              uri: link,
              text: link,
            },
          });
        });
      }

      if (page?.screenshot) {
        response.content.push({
          type: "image",
          data: page.screenshot,
          mimeType: "image/webp",
        });
      }
    });

    return response;
  }
);

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  logWithTimestamp({ data: "hyperbrowser MCP Server running on stdio" });
}

main().catch((error) => {
  logWithTimestamp({
    level: "error",
    data: ["Fatal error in main():", error],
  });
  process.exit(1);
});
