import { z } from "zod";
import {
  CallToolResult,
  ServerRequest,
  ServerNotification,
} from "@modelcontextprotocol/sdk/types.js";
import { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";

import { getClient } from "../utils";
import { BingSearchToolParamSchemaType } from "./tool-types";

const searchResultSchema = z.object({
  title: z.string().describe("The title of the search result"),
  url: z.string().describe("The URL of the search result"),
  snippet: z.string().describe("The snippet of the search result"),
});

const searchResultsSchema = z.object({
  allSearchResults: z.array(searchResultSchema),
});

export async function bingSearchTool(
  params: BingSearchToolParamSchemaType,
  extra: RequestHandlerExtra<ServerRequest, ServerNotification>
): Promise<CallToolResult> {
  const { query, numResults, sessionOptions } = params;

  let apiKey: string | undefined = undefined;
  if (extra.authInfo && extra.authInfo.extra?.isSSE) {
    apiKey = extra.authInfo.token;
  }

  try {
    const client = await getClient({ hbApiKey: apiKey });

    const encodedUrl = encodeURI(`https://www.bing.com/search?q=${query}`);

    const result = await client.extract.startAndWait({
      urls: [encodedUrl],
      sessionOptions: { ...sessionOptions, adblock: true, useProxy: false },
      prompt: `Extract the top ${numResults} search results from this page.`,
      schema: searchResultsSchema,
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
      content: [
        {
          type: "text",
          text: JSON.stringify(result.data, null, 2),
        },
      ],
      isError: false,
    };

    return response;
  } catch (error) {
    return {
      content: [{ type: "text", text: `${error}` }],
      isError: true,
    };
  }
}

export const bingSearchToolName = "search_with_bing";
export const bingSearchToolDescription =
  "Search the web using Bing. This tool allows you to search the web using bing.com";
