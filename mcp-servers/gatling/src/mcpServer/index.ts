import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { Analytics } from "../analytics.js";
import { ApiClient } from "../apiClient/index.js";
import { Config } from "../config.js";
import { tools } from "./tools/index.js";

export const mcpServer = (
  config: Config,
  apiClient: ApiClient,
  analytics: Analytics
): McpServer => {
  const server = new McpServer(
    {
      name: "gatling-mcp",
      title: "Gatling MCP Server",
      version: config.version,
      description:
        "Exposes your Gatling Enterprise resources to AI assistants, enabling natural language interaction with your load testing infrastructure.",
      websiteUrl: "https://docs.gatling.io",
      icons: [
        {
          src: "https://cdn.prod.website-files.com/685a8fe4ddca049f26333871/6870d174865a20d066709f74_gatling-favicon.svg",
          mimeType: "image/svg+xml"
        }
      ]
    },
    {
      instructions: ""
    }
  );

  for (const { name, config, callback } of tools(apiClient)) {
    server.registerTool(
      name,
      config,
      // @ts-ignore
      async (args, extra) => {
        analytics.onToolCall(name);
        const validatedArgs =
          config.inputSchema !== undefined ? config.inputSchema.parse(args) : undefined;
        return callback(validatedArgs, extra);
      }
    );
  }

  return server;
};
