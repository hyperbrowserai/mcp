import {
  CallToolResult,
  ServerRequest,
  ServerNotification,
} from "@modelcontextprotocol/sdk/types.js";
import { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import { getClient } from "../utils";
import { getDownloadsToolParamSchemaType } from "./tool-types";
import axios from "axios";

export async function getDownloadsTool(
  params: getDownloadsToolParamSchemaType,
  extra: RequestHandlerExtra<ServerRequest, ServerNotification>
): Promise<CallToolResult> {
  const { sessionId, downloadZip, outputPath } = params;

  let apiKey: string | undefined = undefined;
  if (extra.authInfo && extra.authInfo.extra?.isSSE) {
    apiKey = extra.authInfo.token;
  }

  try {
    const client = await getClient({ hbApiKey: apiKey });

    // Make API call to get downloads URL
    // Based on the HyperBrowser API: GET /v1/sessions/{sessionId}/downloads
    const apiKeyToUse =
      apiKey || process.env.HB_API_KEY || process.env.HYPERBROWSER_API_KEY;
    
    if (!apiKeyToUse) {
      throw new Error("No API key provided or found in environment variables");
    }

    const response = await axios.get(
      `https://api.hyperbrowser.ai/v1/sessions/${sessionId}/downloads`,
      {
        headers: {
          Authorization: `Bearer ${apiKeyToUse}`,
        },
      }
    );

    const { status, downloadsUrl, error } = response.data;

    if (error) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Error retrieving downloads: ${error}`,
          },
        ],
      };
    }

    const result: CallToolResult = {
      content: [],
      isError: false,
    };

    // Add status information
    result.content.push({
      type: "text",
      text: `Session download status: ${status}`,
    });

    // If downloadsUrl is available and downloadZip is true, download the zip file
    if (downloadsUrl && downloadZip && outputPath) {
      try {
        const fs = await import("fs");
        const path = await import("path");
        
        // Download the zip file
        const zipResponse = await axios.get(downloadsUrl, {
          responseType: "arraybuffer",
        });

        // Ensure output directory exists
        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }

        // Write the zip file
        fs.writeFileSync(outputPath, Buffer.from(zipResponse.data));

        result.content.push({
          type: "text",
          text: `Downloads zip file saved to: ${outputPath}`,
        });
      } catch (downloadError) {
        result.content.push({
          type: "text",
          text: `Error downloading zip file: ${
            downloadError instanceof Error
              ? downloadError.message
              : String(downloadError)
          }`,
        });
      }
    } else if (downloadsUrl) {
      // Just return the URL
      result.content.push({
        type: "text",
        text: `Downloads URL: ${downloadsUrl}`,
      });
    } else {
      result.content.push({
        type: "text",
        text: "No downloads available yet. The session may still be in progress or no files were downloaded.",
      });
    }

    return result;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        content: [
          {
            type: "text",
            text: `API Error: ${error.response?.status} - ${
              error.response?.data?.error || error.message
            }`,
          },
        ],
        isError: true,
      };
    }

    return {
      content: [{ type: "text", text: `${error}` }],
      isError: true,
    };
  }
}

export const getDownloadsToolName = "get_session_downloads";
export const getDownloadsToolDescription = `
Retrieve files that were downloaded during a HyperBrowser session. This tool accesses the session's downloads via the HyperBrowser API.

Prerequisites:
- The session must have been created with saveDownloads: true option
- The session must be completed (or at least have downloads available)

Parameters:
- sessionId: The ID of the HyperBrowser session to retrieve downloads from
- downloadZip: (Optional) If true, downloads the zip file containing all session downloads
- outputPath: (Optional) Required if downloadZip is true. Local path where the zip file should be saved

Returns:
- Session download status (pending, in_progress, completed, failed)
- Downloads URL (temporary URL to download zip file)
- If downloadZip is true and outputPath is provided: Confirmation of local zip file saved

Note: The downloads URL is temporary and will expire after some time. Download the zip file promptly if needed.
`.trim();
