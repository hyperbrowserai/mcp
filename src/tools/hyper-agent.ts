import {
  CallToolResult,
  ServerRequest,
  ServerNotification,
} from "@modelcontextprotocol/sdk/types.js";
import { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import { getClient } from "../utils";
import { hyperAgentToolParamSchemaType } from "./tool-types";

export async function hyperAgentTool(
  params: hyperAgentToolParamSchemaType,
  extra: RequestHandlerExtra<ServerRequest, ServerNotification>
): Promise<CallToolResult> {
  const { task, sessionOptions, returnStepInfo, maxSteps } = params;

  let apiKey: string | undefined = undefined;
  if (extra.authInfo && extra.authInfo.extra?.isSSE) {
    apiKey = extra.authInfo.token;
  }

  try {
    const client = await getClient({ hbApiKey: apiKey });

    const result = await client.agents.hyperAgent.startAndWait({
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

export const hyperAgentToolName = "hyper_agent";
export const hyperAgentToolDescription = `
This tool utilizes Hyperbrowser's native HyperAgent to autonomously execute browser-based tasks with advanced reasoning and action capabilities using a cloud browser. It provides a powerful, flexible agent framework optimized for complex automation scenarios.

Optimal for tasks requiring:
- Advanced reasoning and decision-making capabilities
- Complex multi-step browser automation workflows
- Flexible action execution with built-in memory and goal tracking
- Production-grade browser automation with robust error handling

Best suited use cases include:
- Complex multi-step processes requiring sophisticated reasoning
- Advanced web application interactions and workflows
- Detailed research and data extraction with multiple decision points
- Production automation tasks requiring reliability and flexibility

Provide detailed task instructions, necessary context, and clearly specify the desired outcome. Returns the completed result with step-by-step execution details or an error message if issues arise.`.trim();

