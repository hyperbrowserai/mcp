import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
// Import helper
import { getClient, prepareSessionOptions } from "../utils";
import { extractStructuredDataToolParamSchemaType } from "./tool-types";

export async function extractStructuredDataTool({
  urls,
  sessionOptions: inputSessionOptions,
  prompt,
  schema,
}: extractStructuredDataToolParamSchemaType): Promise<CallToolResult> {
  try {
    const client = await getClient();

    // Use helper
    const finalSessionOptions = prepareSessionOptions(inputSessionOptions);

    const params = {
      urls,
      sessionOptions: finalSessionOptions, // Pass options from helper
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
  } catch (error) {
    return {
      content: [{ type: "text", text: `${error}` }],
      isError: true,
    };
  }
}

export const extractStructuredDataToolName = "extract_structured_data";
export const extractStructuredDataToolDescription =
  "Extract structured data from a webpage. This tool allows you to extract structured data from a webpage using a schema.";
