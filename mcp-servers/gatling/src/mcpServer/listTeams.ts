import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as z from "zod";

import { Analytics } from "../analytics.js";
import { ApiClient } from "../apiClient/index.js";

const OutputSchema = z.object({
  data: z.array(
    z.object({
      name: z.string(),
      _id: z.string(),
      _limits: z.object({
        credits: z
          .object({
            quota: z.number()
          })
          .optional()
      }),
      _creditsUsed: z.number()
    })
  )
});
type OutputSchema = z.infer<typeof OutputSchema>;

export const registerListTeams = (
  server: McpServer,
  apiClient: ApiClient,
  analytics: Analytics
): void => {
  const name = "list_gatling_enterprise_teams";
  server.registerTool(
    name,
    {
      title: "List Gatling Enterprise Teams",
      description: "List all existing teams in Gatling Enterprise",
      outputSchema: OutputSchema
    },
    async () => {
      analytics.onToolCall(name);
      const response = await apiClient.teams.readAll();
      const structuredContent: OutputSchema = {
        data: response.data.map((item) => ({
          name: item.name,
          _id: item._id,
          _limits: item._limits.credits
            ? {
                credits: {
                  quota: item._limits.credits?.quota
                }
              }
            : {},
          _creditsUsed: item._creditsUsed
        }))
      };
      return {
        content: [{ type: "text", text: JSON.stringify(structuredContent) }],
        structuredContent
      };
    }
  );
};
