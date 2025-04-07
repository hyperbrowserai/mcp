import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
// Import helper
import { getClient, prepareSessionOptions } from "../utils";
import { browserUseToolParamSchemaType } from "./tool-types";

export async function browserUseTool({
  task,
  sessionOptions: inputSessionOptions,
  returnStepInfo,
  maxSteps,
}: browserUseToolParamSchemaType): Promise<CallToolResult> {
  try {
    const client = await getClient();

    // Use helper
    const finalSessionOptions = prepareSessionOptions(inputSessionOptions);

    const result = await client.agents.browserUse.startAndWait({
      task,
      sessionOptions: finalSessionOptions, // Pass options from helper
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
This tool employs an open-source browser automation agent optimized specifically for fast, efficient, and cost-effective browser tasks using a cloud browser. It requires explicit, detailed instructions to perform highly specific interactions quickly.

Optimal for tasks requiring:
- Precise, explicitly defined interactions and actions
- Speed and efficiency with clear, unambiguous instructions
- Cost-effective automation at scale with straightforward workflows

Best suited use cases include:
- Explicitly defined registration and login processes
- Clearly guided navigation through web apps
- Structured, step-by-step web scraping with detailed guidance
- Extracting data via explicitly specified browser interactions

You must provide extremely detailed step-by-step instructions, including exact elements, actions, and explicit context. Clearly define the desired outcome for optimal results. Returns the completed result or an error message if issues arise.

Note: This agent trades off flexibility for significantly faster performance and lower costs compared to Claude and OpenAI agents.`.trim();
