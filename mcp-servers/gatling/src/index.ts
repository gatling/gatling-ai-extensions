import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { analyticsInit, analyticsOnServerReady } from "./analytics.js";
import { apiClient } from "./apiClient/index.js";
import { readConfig } from "./config.js";
import { mcpServer } from "./mcpServer/index.js";

const main = async (): Promise<void> => {
  const config = readConfig();
  analyticsInit(config);

  const client = apiClient(config.apiClient);
  const server = mcpServer(config, client);
  const transport = new StdioServerTransport();

  await server.connect(transport);
  console.log(`Gatling MCP Server v${config.version} running on stdio`);
  analyticsOnServerReady();
};

main().catch((error) => {
  console.error("Gatling MCP Server fatal error:", error);
  process.exit(1);
});
