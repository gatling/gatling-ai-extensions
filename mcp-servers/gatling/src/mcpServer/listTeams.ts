import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as z from "zod";

import { analyticsOnToolCall } from "../analytics.js";
import { ApiClient } from "../apiClient/index.js";

const OutputSchema = z.object({
  teams: z.array(
    z.object({
      name: z.string(),
      id: z.string()
    })
  )
});
type OutputSchema = z.infer<typeof OutputSchema>;

export const registerListTeams = (server: McpServer, apiClient: ApiClient): void => {
  const name = "list_gatling_enterprise_teams";
  server.registerTool(
    name,
    {
      title: "List Gatling Enterprise Teams",
      description: "List all existing teams in Gatling Enterprise",
      outputSchema: OutputSchema
    },
    async () => {
      analyticsOnToolCall(name);
      const teamsResponse = await apiClient.team.list();
      const structuredContent: OutputSchema = {
        teams: teamsResponse.data.map((t) => ({
          name: t.name,
          id: t._id
        }))
      };
      return {
        content: [{ type: "text", text: JSON.stringify(structuredContent) }],
        structuredContent
      };
    }
  );
};
