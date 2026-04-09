import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as z from "zod";

import { Analytics } from "../analytics.js";
import { ApiClient } from "../apiClient/index.js";
import { TestTypeResponse } from "../apiClient/tests.js";

const OutputSchema = z.object({
  data: z.array(
    z.object({
      name: z.string(),
      _id: z.string(),
      _teamId: z.string(),
      _updatedAt: z.string(),
      source: z.object({
        type: z.enum(TestTypeResponse)
      })
    })
  )
});
type OutputSchema = z.infer<typeof OutputSchema>;

export const registerListTests = (
  server: McpServer,
  apiClient: ApiClient,
  analytics: Analytics
): void => {
  const name = "list_gatling_enterprise_tests";
  server.registerTool(
    name,
    {
      title: "List Gatling Enterprise Tests",
      description: "List all tests (aka simulations) deployed in Gatling Enterprise",
      outputSchema: OutputSchema
    },
    async () => {
      analytics.onToolCall(name);
      const response = await apiClient.tests.readAll();
      const structuredContent: OutputSchema = {
        data: response.data.map((item) => ({
          name: item.name,
          _id: item._id,
          _teamId: item._teamId,
          _updatedAt: item._updatedAt,
          source: {
            type: item.source.type
          }
        }))
      };
      return {
        content: [{ type: "text", text: JSON.stringify(structuredContent) }],
        structuredContent
      };
    }
  );
};
