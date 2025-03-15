import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { getClient } from "../utils";
import { browserUseToolParamSchemaType } from "./tool-types";

export async function browserUseTool({
  task,
  apiKey,
  sessionOptions,
  returnStepInfo,
  maxSteps,
}: browserUseToolParamSchemaType): Promise<CallToolResult> {
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

  const result = await client.beta.agents.browserUse.startAndWait({
    task,
    sessionOptions,
    maxSteps,
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

  if (result.data) {
    let taskData = result.data;

    if (!returnStepInfo) {
      taskData.steps = [];
    }

    response.content.push({
      type: "text",
      text: JSON.stringify(taskData),
    });
  } else {
    response.content.push({
      type: "text",
      text: "Task result data is empty/missing",
      isError: true,
    });
  }

  return response;
}

export const browserUseToolName = "browser_use";
export const browserUseToolDescription =
  "Perform a certain task inside a browser session. Will perform the entirety of the task inside the browser, and return the results.";
