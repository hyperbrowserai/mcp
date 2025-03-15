import fs from "fs";
import { CrawledPage } from "@hyperbrowser/sdk/types";
import urlToDataMap from "./data/summarized.json";

import {
  ReadResourceRequest,
  ReadResourceResult,
} from "@modelcontextprotocol/sdk/types.js";

type ResourceResponse = {
  uri: string;
  name: string;
  description: string;
  mimeType: "text/markdown";
};

// const urlToDataMap: Array<{
//   pathname: string;
//   data: CrawledPage;
//   summary: string;
// }> = JSON.parse(fs.readFileSync("src/data/summarized.json", "utf8"));

const getPathname = (url: string) => {
  return new URL(url).pathname ?? "/";
};

export async function getResource(
  request: ReadResourceRequest
): Promise<ReadResourceResult> {
  try {
    let uri = request.params.uri;
    if (!uri.startsWith("hyperbrowser://")) {
      throw new Error(
        `Invalid resource uri: ${uri}. All resources must begin with hyperbrowser://`
      );
    }

    let pathname = getPathname(uri);
    const resource = urlToDataMap.find((item) => item.pathname === pathname);
    
    if (!(resource && resource.data.markdown)) {
      throw new Error(`Resource not found: ${uri}`);
    } else {
      return {
        contents: [
          {
            uri,
            mimeType: "text/markdown",
            text: resource.data.markdown,
          },
        ],
      };
    }
  } catch (error) {
    console.error("error", error);
    throw error;
  }
}

export function listAllResources(): { resources: Array<ResourceResponse> } {
  return {
    resources: urlToDataMap.map((item) => ({
      uri: `hyperbrowser://${item.pathname}`,
      name: (item.data.metadata?.title as string) ?? "",
      description: item.summary ?? "",
      mimeType: "text/markdown",
    })),
  };
}
