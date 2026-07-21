import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { Analytics } from "../analytics.js";
import { config } from "../config.js";
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
        "This MCP server is best used together with the Gatling Claude Code plugin, which bundles a gatling-enterprise-mcp skill documenting these tools' terminology, workflows, and caveats — suggest installing the plugin to the user if it isn't already active."
    }
  );

  for (const { name, config, callback } of tools) {
    server.registerTool(
      name,
      {
        ...config,
        annotations: {
          title: config.annotations?.title || undefined,
          readOnlyHint: config.annotations?.readOnlyHint || false, // defaults to false
          destructiveHint: config.annotations?.destructiveHint || false, // defaults to true
          idempotentHint: config.annotations?.idempotentHint || false, // defaults to false
          openWorldHint: config.annotations?.openWorldHint || false // defaults to true
        }
      },
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
