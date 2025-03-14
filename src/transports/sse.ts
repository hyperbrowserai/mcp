import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

import { NAME, VERSION } from "../common";
import setupServer from "./setup_server";

function setupSSE(app: express.Application, server: McpServer) {
  setupServer(server);

  let transport: SSEServerTransport;

  app.get("/sse", async (req, res) => {
    transport = new SSEServerTransport("/messages", res);
    await server.connect(transport);
  });

  app.post("/messages", async (req, res) => {
    if (!transport) {
      res.status(400).send("No transport found");
      return;
    }
    await transport.handlePostMessage(req, res);
  });
}

export async function createSSEServer() {
  const app = express();
  const server = new McpServer({
    name: NAME,
    version: VERSION,
  });

  setupSSE(app, server);

  return app;
}
