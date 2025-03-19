import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { getClient } from "../utils";
import { browserUseToolParamSchemaType } from "./tool-types";
import { oaiCuaToolName } from "./oai-cua";

export async function browserUseTool({
  task,
  sessionOptions,
  returnStepInfo,
  maxSteps,
}: browserUseToolParamSchemaType): Promise<CallToolResult> {
  try {
    const client = await getClient();

    const result = await client.agents.browserUse.startAndWait({
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
  } catch (error) {
    return {
      content: [{ type: "text", text: `${error}` }],
      isError: true,
    };
  }
}

export const browserUseToolName = "browser_use_agent";
export const browserUseToolDescription = `
This tool uses an open-source browser automation agent to perform browser-based tasks using a cloud browser. \
It can navigate websites, fill forms, extract information, and interact with web applications.

This tool is ideal for tasks that require multi-step browser interactions that cannot be accomplished with simpler tools \
like scraping, screenshots, or web extraction. For optimal results:
1. Provide **extremely detailed, explicit step-by-step instructions** for the task
2. Include **all** relevant context (credentials, form data, specific instructions)
3. Specify the **exact elements** to interact with and **precise actions** to take
4. Clearly define the **expected outcome** or information to retrieve

Example use cases:
- Completing registration processes with explicit guidance
- Navigating web applications with detailed instructions
- Performing research across multiple pages with clear directions
- Extracting data that requires specific interaction steps

Note: This agent requires more explicit guidance than other tools but offers faster performance and lower cost. \
Be prepared to provide **very detailed instructions** for optimal results. If you need higher accuracy but are \
willing to spend more time and money on the task, you should use the ${oaiCuaToolName} tool instead.

The tool will return the final result upon completion or an error message if it encounters issues.`.trim();
