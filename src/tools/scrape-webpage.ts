import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { getClient, downloadImageAsBase64 } from "../utils";
import { scrapeWebpageToolParamSchemaType } from "./tool-types";

export async function scrapeWebpageTool({
    url,
    apiKey,
    sessionOptions,
    outputFormat,
}: scrapeWebpageToolParamSchemaType): Promise<CallToolResult> {
    const currentApiKey =
        apiKey ?? process.env.HB_API_KEY ?? process.env.HYPERBROWSER_API_KEY;
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

export const scrapeWebpageToolName = "scrape_webpage";
export const scrapeWebpageToolDescription = "Scrape a webpage and extract its content in various formats. This tool allows fetching content from a single URL with configurable browser behavior options. Use this for extracting text content, HTML structure, collecting links, or capturing screenshots of webpages.";
