import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { ApiClient } from "../apiClient/index.js";
import { Config } from "../config.js";
import { registerListLocations } from "./listLocations.js";
import { registerListPackages } from "./listPackages.js";
import { registerListTests } from "./listTests.js";
import { registerListTeams } from "./listTeams.js";

export const mcpServer = (config: Config, apiClient: ApiClient): McpServer => {
  const server = new McpServer({
    name: "gatling-mcp-server",
    version: config.version
  });

  registerListTeams(server, apiClient);
  registerListPackages(server, apiClient);
  registerListTests(server, apiClient);
  registerListLocations(server, apiClient);

  return server;
};
