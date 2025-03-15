import axios from "axios";

import { parseLLMsFile } from "./llms-txt-parser";
import { Resource } from "@modelcontextprotocol/sdk/types.js";

const RESOURCE_URL = "https://docs.hyperbrowser.ai/llms.txt";

async function parseResources() {
  try {
    const response = await axios.get(RESOURCE_URL);
    const document = parseLLMsFile(response.data);
    return {
      resources: document.allLinks.map<Resource>((link) => ({
        uri: new URL(link.url).pathname,
        name: link.title,
        description: link.description,
        mimeType: "text/markdown",
      })),
      tools: [],
    };
  } catch (err) {
    return {};
  }
}

export default parseResources;
