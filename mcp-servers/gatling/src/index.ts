#!/usr/bin/env node

import { serveStdio } from "@modelcontextprotocol/server/stdio";

import { mcpServer } from "./mcpServer/index.js";
import { analyticsInit } from "./analytics.js";

try {
  const analytics = analyticsInit();
  const handle = serveStdio(() => mcpServer(analytics));

  process.on("SIGINT", () => {
    handle
      .close()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  });

  analytics.onServerReady();
} catch (error) {
  console.error("Gatling MCP Server fatal error:", error);
  process.exit(1);
}
