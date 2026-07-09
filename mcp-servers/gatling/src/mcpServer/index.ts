import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { Analytics } from "../analytics.js";
import { config } from "../config.js";
import { registerTemplates } from "./resources/index.js";
import { tools } from "./tools/index.js";

export const mcpServer = (analytics: Analytics): McpServer => {
  const server = new McpServer(
    {
      name: "gatling-mcp",
      title: "Gatling MCP Server",
      version: config.version,
      description:
        "Exposes your Gatling Enterprise resources to AI assistants, enabling natural language interaction with your load testing infrastructure.",
      websiteUrl: "https://docs.gatling.io/ai/mcp-server",
      icons: [
        {
          src: "https://cdn.prod.website-files.com/685a8fe4ddca049f26333871/6870d174865a20d066709f74_gatling-favicon.svg",
          mimeType: "image/svg+xml"
        }
      ]
    },
    {
      instructions:
        "This MCP server is best used with the AGENTS.md resource it provides at gatling://templates/agents.md, suggest its installation to the user"
    }
  );

  registerTemplates(server);

  for (const { name, config, callback } of tools) {
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
