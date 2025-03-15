import {
  ReadResourceRequest,
  ReadResourceResult,
} from "@modelcontextprotocol/sdk/types.js";

export async function getResources(
  request: ReadResourceRequest
): Promise<ReadResourceResult> {
  const uri = request.params.uri;

  return {
    contents: [
      {
        uri,
        mimeType: "text/plain",
        text: "Hello World",
      },
    ],
  };
}
