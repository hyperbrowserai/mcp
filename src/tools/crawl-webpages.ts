import {
  CallToolResult,
  ServerRequest,
  ServerNotification,
} from "@modelcontextprotocol/sdk/types.js";
import { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import { getClient } from "../utils";
import { crawlWebpagesToolParamSchemaType } from "./tool-types";

export async function crawlWebpagesTool(
  params: crawlWebpagesToolParamSchemaType,
  extra: RequestHandlerExtra<ServerRequest, ServerNotification>
): Promise<CallToolResult> {
  const {
    url,
    sessionOptions,
    outputFormat,
    ignoreSitemap,
    followLinks,
    maxPages,
  } = params;

  let apiKey: string | undefined = undefined;
  if (extra.authInfo && extra.authInfo.extra?.isSSE) {
    apiKey = extra.authInfo.token;
  }

  try {
    const client = await getClient({ hbApiKey: apiKey });

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
  } catch (error) {
    return {
      content: [{ type: "text", text: `${error}` }],
      isError: true,
    };
  }
}

export const crawlWebpagesToolName = "crawl_webpages";
export const crawlWebpagesToolDescription =
  "Crawl a website starting from a URL and explore linked pages. This tool allows systematic collection of content from multiple pages within a domain. Use this for larger data collection tasks, content indexing, or site mapping.";
