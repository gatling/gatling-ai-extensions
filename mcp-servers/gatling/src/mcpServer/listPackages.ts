import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as z from "zod";

import { Analytics } from "../analytics.js";
import { ApiClient } from "../apiClient/index.js";
import { PackageItemResponse } from "../apiClient/packages.js";

const PackageSchema = z.object({
  name: z.string(),
  teamId: z.string(),
  _id: z.string(),
  _format: z.string().optional()
});
type PackageSchema = z.infer<typeof PackageSchema>;

const OutputSchema = z.object({
  managedPackages: z.array(PackageSchema),
  privatePackages: z.array(PackageSchema)
});
type OutputSchema = z.infer<typeof OutputSchema>;

export const registerListPackages = (
  server: McpServer,
  apiClient: ApiClient,
  analytics: Analytics
): void => {
  const name = "list_gatling_enterprise_packages";
  server.registerTool(
    name,
    {
      title: "List Gatling Enterprise Packages",
      description:
        "List all packages deployed in Gatling Enterprise. Managed packages are stored on Gatling Enterprise, private packages are stored on the infrastructure of the user's organization.",
      outputSchema: OutputSchema
    },
    async () => {
      analytics.onToolCall(name);
      const response = await apiClient.packages.readAll();
      const mapItem = (item: PackageItemResponse): PackageSchema => ({
        name: item.name,
        teamId: item.teamId,
        _id: item._id,
        _format: item._storage.artifact?.format
      });
      const structuredContent: OutputSchema = {
        managedPackages: response.data
          .filter((item) => item._storage.type === "managed")
          .map(mapItem),
        privatePackages: response.data
          .filter((item) => item._storage.type === "private")
          .map(mapItem)
      };
      return {
        content: [{ type: "text", text: JSON.stringify(structuredContent) }],
        structuredContent
      };
    }
  );
};
