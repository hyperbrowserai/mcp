#!/usr/bin/env node

import { logWithTimestamp } from "./utils.js";
import { createSSEServer } from "./transports/sse.js";
import { createStdioServer } from "./transports/stdio.js";

const SSE_PORT = process.env.SSE_PORT || 3001;

// Start the server
async function main() {
  // Check if SSE transport is requested via command line flag
  const useSSE = process.argv.includes("--sse");
  if (useSSE) {
    await createSSEServer().then((app) =>
      app.listen(SSE_PORT, () => {
        logWithTimestamp({
          data: `hyperbrowser MCP Server running on http://localhost:${SSE_PORT}`,
        });
      })
    );
  } else {
    await createStdioServer();
  }
}

main().catch((error) => {
  logWithTimestamp({
    level: "error",
    data: ["Fatal error in main():", error],
  });
  process.exit(1);
});
