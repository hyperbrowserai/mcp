import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
// Import helper
import { getClient, prepareSessionOptions } from "../utils";
import { oaiCuaToolParamSchemaType } from "./tool-types";

export async function oaiCuaTool({
  task,
  sessionOptions: inputSessionOptions,
  returnStepInfo,
  maxSteps,
}: oaiCuaToolParamSchemaType): Promise<CallToolResult> {
  try {
    const client = await getClient();

    // Use helper
    const finalSessionOptions = prepareSessionOptions(inputSessionOptions);

    const result = await client.agents.cua.startAndWait({
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

      const toolResultText = `Final Result: ${
        taskData.finalResult
      }\n\nSteps: ${JSON.stringify(taskData.steps, null, 2)}`;

      response.content.push({
        type: "text",
        text: toolResultText,
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

export const oaiCuaToolName = "openai_computer_use_agent";
export const oaiCuaToolDescription = `
This tool utilizes OpenAI's model to autonomously execute general-purpose browser-based tasks with balanced performance and reliability using a cloud browser. It handles complex interactions effectively with practical reasoning and clear execution.

Optimal for tasks requiring:
- Reliable, general-purpose browser automation
- Clear, structured interactions with moderate complexity
- Efficient handling of common web tasks and workflows

Best suited use cases include:
- Standard multi-step registration or form submissions
- Navigating typical web applications requiring multiple interactions
- Conducting structured web research tasks
- Extracting data through interactive web processes

Provide a clear step-by-step description, necessary context, and expected outcomes. Returns the completed result or an error message if issues arise.`.trim();
