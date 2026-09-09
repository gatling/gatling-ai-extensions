#!/usr/bin/env node

import { createMcpExpressApp } from "@modelcontextprotocol/express";
import { toNodeHandler } from "@modelcontextprotocol/node";
import { createMcpHandler } from "@modelcontextprotocol/server";

import { mcpServer } from "./mcpServer/index.js";
import { analyticsInit } from "./analytics.js";

try {
  const analytics = analyticsInit();

  const mcpHandler = createMcpHandler(() => mcpServer(analytics));
  const nodeHandler = toNodeHandler(mcpHandler);

  const app = createMcpExpressApp();
  app.all("/mcp", (req, res) => void nodeHandler(req, res, req.body));
  analytics.onServerReady();
  app.listen(3000);
} catch (error) {
  console.error("Gatling MCP Server fatal error:", error);
  process.exit(1);
}
