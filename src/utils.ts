import { config } from "dotenv";
import { Hyperbrowser } from "@hyperbrowser/sdk";

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
