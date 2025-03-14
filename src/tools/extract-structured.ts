import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { getClient } from "../utils";
import { extractStructuredDataToolParamSchemaType } from "./tool-types";


export async function extractStructuredDataTool({
  urls,
  apiKey,
  sessionOptions,
  prompt,
  schema,
}: extractStructuredDataToolParamSchemaType): Promise<CallToolResult> {
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

export const extractStructuredDataToolName = "extract_structured_data";
export const extractStructuredDataToolDescription = "Extract structured data from a webpage. This tool allows you to extract structured data from a webpage using a schema.";