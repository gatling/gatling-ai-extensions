import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as z from "zod";

import { analyticsOnToolCall } from "../analytics.js";
import { ApiClient } from "../apiClient/index.js";

const OutputSchema = z.object({
  tests: z.array(
    z.object({
      name: z.string(),
      id: z.string(),
      teamId: z.string(),
      className: z.string()
    })
  )
});
type OutputSchema = z.infer<typeof OutputSchema>;

export const registerListTests = (server: McpServer, apiClient: ApiClient): void => {
  const name = "list_gatling_enterprise_tests";
  server.registerTool(
    name,
    {
      title: "List tests in Gatling Enterprise",
      description: "List all tests (aka simulations) deployed in Gatling Enterprise",
      outputSchema: OutputSchema
    },
    async () => {
      analyticsOnToolCall(name);
      const testsResponse = await apiClient.simulation.list();
      const structuredContent: OutputSchema = {
        tests: testsResponse.map((s) => ({
          name: s.name,
          id: s.idV2,
          teamId: s.teamId,
          className: s.className
        }))
      };
      return {
        content: [{ type: "text", text: JSON.stringify(structuredContent) }],
        structuredContent
      };
    }
  );
};
