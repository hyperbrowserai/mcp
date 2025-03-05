import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { downloadImageAsBase64, getClient, logWithTimestamp } from "./utils.js";
import { Ajv } from "ajv";
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
    .describe("Options for the browser session. Avoid setting these if not mentioned explicitly");
const apiKeySchema = z
    .string()
    .optional()
    .describe("The API key to use for the scrape");
// Register hyperbrowser tools
server.tool("scrape-webpage", "Scrape a webpage", {
    url: z.string().url().describe("The URL of the webpage to scrape"),
    apiKey: apiKeySchema,
    sessionOptions: sessionOptionsSchema,
    outputFormat: z
        .array(z.enum(["markdown", "html", "links", "screenshot"]))
        .min(1)
        .describe("The format of the output"),
}, async ({ url, apiKey, sessionOptions, outputFormat, }) => {
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
    const response = {
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
        }
        else {
            response.content.push({
                type: "image",
                data: imageData.data,
                mimeType: imageData.mimeType,
            });
        }
    }
    return response;
});
server.tool("extract-structured-data", "Extract structured-information from a webpage", {
    urls: z
        .array(z.string().url())
        .describe("The list of URLs of the webpages to extract structured information from. Can include wildcards (e.g. https://example.com/*)"),
    apiKey: apiKeySchema,
    prompt: z.string().describe("The prompt to use for the extraction"),
    schema: z
        .any({})
        .transform((schema) => {
        if (!schema) {
            return false;
        }
        else {
            try {
                if (typeof schema === "string") {
                    try {
                        const parsedSchema = JSON.parse(schema);
                        const validate = ajv.compile(parsedSchema);
                        if (typeof validate === "function") {
                            return parsedSchema;
                        }
                        else {
                            return undefined;
                        }
                    }
                    catch (err) {
                        return undefined;
                    }
                }
                else {
                    const validate = ajv.compile(schema);
                    if (typeof validate === "function") {
                        return schema;
                    }
                    else {
                        return undefined;
                    }
                }
            }
            catch (err) {
                return false;
            }
        }
    })
        .describe("The json schema to use for the extraction. Must provide an object describing a spec compliant json schema, any other types are invalid."),
    sessionOptions: sessionOptionsSchema,
}, async ({ urls, apiKey, sessionOptions, prompt, schema, }) => {
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
    const response = {
        content: [
            {
                type: "text",
                text: JSON.stringify(result.data, null, 2),
            },
        ],
        isError: false,
    };
    return response;
});
server.tool("crawl-webpages", "Crawl a list of webpages", {
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
}, async ({ url, apiKey, sessionOptions, outputFormat, ignoreSitemap, followLinks, maxPages, }) => {
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
    const response = {
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
});
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
