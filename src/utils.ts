import { config } from "dotenv";
import { Hyperbrowser } from "@hyperbrowser/sdk";
import { CreateSessionParams } from "@hyperbrowser/sdk/types";

config();

export const getClient = async () => {
  const apiKey = process.env.HB_API_KEY || process.env.HYPERBROWSER_API_KEY;
  if (!apiKey) {
    throw new Error("No API key provided or found in environment variables");
  }
  return new Hyperbrowser({ apiKey });
};

export const logWithTimestamp = ({
  level = "info",
  name = "hyperbrowser",
  data,
}: {
  level?: "info" | "warning" | "error";
  name?: string;
  data?: any;
}) => {
  const timestamp = new Date().toISOString();

  const consoleData = [`${timestamp} [${name}] [${level}]`];
  if (Array.isArray(data)) {
    consoleData.push(...data);
  } else {
    consoleData.push(data);
  }

  console.error(...consoleData);
};

/**
 * Downloads an image from a URL and converts it to base64
 * @param imageUrl The URL of the image to download
 * @returns Promise resolving to the base64-encoded image data
 */
export const downloadImageAsBase64 = async (
  imageUrl: string
): Promise<{ data: string; mimeType: string } | null> => {
  try {
    // Fetch the image
    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to download image: ${response.status} ${response.statusText}`
      );
    }

    // Get the image data as an ArrayBuffer
    const imageBuffer = await response.arrayBuffer();

    const buffer = Buffer.from(imageBuffer);
    const base64Data = buffer.toString("base64");

    const contentType = response.headers.get("content-type") || "image/jpeg";

    // Return the complete base64 data URI
    return { data: base64Data, mimeType: contentType };
  } catch (error) {
    logWithTimestamp({
      level: "error",
      data: `Error downloading image from ${imageUrl}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    });
    return null;
  }
};

// Define a type for the input options coming from MCP tools (includes profileId)
// We extend the SDK type but add profileId and remove the nested profile
type McpSessionOptions = Omit<CreateSessionParams, 'profile'> & {
  profileId?: string;
};


/**
 * Prepares session options for the Hyperbrowser SDK, handling the profileId.
 * Uses types directly from the @hyperbrowser/sdk.
 * @param inputOptions The session options received from the MCP tool input (McpSessionOptions).
 * @param defaults Optional default options specific to the tool calling this function.
 * @returns Session options formatted for the Hyperbrowser SDK (CreateSessionParams).
 */
export const prepareSessionOptions = (
  inputOptions: McpSessionOptions | undefined | null,
  defaults: Partial<CreateSessionParams> = {}
): CreateSessionParams => {
  // Start with defaults, then merge input options
  // Ensure correct typing for the intermediate object before profileId is deleted
  const intermediateOptions: McpSessionOptions = {
    ...defaults,
    ...(inputOptions || {}),
  };

  // Prepare the final options object conforming to CreateSessionParams
  const finalOptions: CreateSessionParams = { ...intermediateOptions };

  // Handle profileId if present
  if (intermediateOptions?.profileId) {
    finalOptions.profile = { // Add the nested profile object expected by SDK
      id: intermediateOptions.profileId,
      persistChanges: true, // Always persist changes when using a profile
    };
  }

  // Remove profileId from the final object as it's not part of CreateSessionParams
  delete (finalOptions as any).profileId; // Use type assertion to allow deletion

  return finalOptions;
};
