import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as z from "zod";

import { analyticsOnToolCall } from "../analytics.js";
import { ApiClient } from "../apiClient/index.js";
import { managedLocations } from "../constants.js";

const OutputSchema = z.object({
  managedLocations: z.array(z.string()),
  privateLocations: z.array(
    z.object({
      id: z.string(),
      organizationSlug: z.string(),
      type: z.string(),
      description: z.string().optional()
    })
  )
});
type OutputSchema = z.infer<typeof OutputSchema>;

export const registerListLocations = (server: McpServer, apiClient: ApiClient): void => {
  const name = "list_gatling_enterprise_locations";
  server.registerTool(
    name,
    {
      title: "List Gatling Enterprise Locations",
      description:
        "List all managed and private locations where tests can be run on Gatling Enterprise. Group managed location IDs by region, private location IDs by type.",
      outputSchema: OutputSchema
    },
    async () => {
      analyticsOnToolCall(name);
      const privateLocationsResponse = await apiClient.privateLocation.list();
      const privateLocations = privateLocationsResponse.data.map((pl) => ({
        id: pl.id,
        organizationSlug: pl.organizationSlug,
        type: pl.type,
        description: pl.description
      }));
      const structuredContent: OutputSchema = {
        managedLocations,
        privateLocations
      };
      return {
        content: [{ type: "text", text: JSON.stringify(structuredContent) }],
        structuredContent
      };
    }
  );
};
