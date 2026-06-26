#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { analyticsInit } from "./analytics.js";
import { mcpServer } from "./mcpServer/index.js";

const main = async (): Promise<void> => {
  const analytics = analyticsInit();
  const server = mcpServer(analytics);

  process.on("SIGINT", () => {
    server
      .close()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  });
  const transport = new StdioServerTransport();

  await server.connect(transport);
  analytics.onServerReady();
};

main().catch((error) => {
  console.error("Gatling MCP Server fatal error:", error);
  process.exit(1);
});
