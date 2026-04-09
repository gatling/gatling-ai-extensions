import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as z from "zod";

import { Analytics } from "../analytics.js";
import { ApiClient } from "../apiClient/index.js";
import { isManagedLocation, isPrivateLocation } from "../apiClient/locations.js";

const OutputSchema = z.object({
  managedLocations: z.array(z.string()),
  privateLocations: z.array(
    z.object({
      id: z.string(),
      artifactFormats: z.array(z.string()),
      description: z.string().optional()
    })
  )
});
type OutputSchema = z.infer<typeof OutputSchema>;

export const registerListLocations = (
  server: McpServer,
  apiClient: ApiClient,
  analytics: Analytics
): void => {
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
      analytics.onToolCall(name);
      const response = await apiClient.locations.readAll();
      const privateLocations = response.data.flatMap((item) => {
        if (isPrivateLocation(item)) {
          return [
            {
              id: item._id,
              artifactFormats: item._capabilities.artifactFormats,
              description: item._description
            }
          ];
        } else {
          return [];
        }
      });
      const rawManagedLocations = response.data.flatMap((item) => {
        if (isManagedLocation(item)) {
          return item._name;
        } else {
          return [];
        }
      });
      // There can be duplicates because there are different IDs for jvm/js support
      const managedLocations = [...new Set(rawManagedLocations)];
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
