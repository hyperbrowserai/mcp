import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { getClient } from "../utils";
import { ClaudeComputerUseToolParamSchemaType } from "./tool-types";

export async function claudeComputerUseTool({
  task,
  sessionOptions,
  returnStepInfo,
  maxSteps,
}: ClaudeComputerUseToolParamSchemaType): Promise<CallToolResult> {
  try {
    const client = await getClient();

    const result = await client.agents.claudeComputerUse.startAndWait({
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

export const claudeComputerUseToolName = "claude_computer_use_agent";
export const claudeComputerUseToolDescription = `
This tool leverages Anthropic's Claude model to autonomously execute complex browser tasks with sophisticated reasoning capabilities using a cloud browser. It specializes in handling intricate, nuanced, or highly context-sensitive web interactions.

Optimal for tasks requiring:
- Complex reasoning over multiple web pages
- Nuanced interpretation and flexible decision-making
- Human-like interaction with detailed context awareness

Best suited use cases include:
- Multi-step processes requiring reasoning (e.g., detailed registrations or onboarding)
- Interacting intelligently with advanced web apps
- Conducting in-depth research with complex conditions
- Extracting information from dynamic or interactive websites

Provide detailed task instructions, relevant context, and clearly specify the desired outcome for best results. Returns the completed result or an error message if issues arise.`.trim();
