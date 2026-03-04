import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as z from "zod";

import { analyticsOnToolCall } from "../analytics.js";
import { ApiClient } from "../apiClient/index.js";
import { PackageResponse } from "../apiClient/package.js";

const PackageSchema = z.object({
  id: z.string(),
  teamId: z.string(),
  name: z.string(),
  format: z.string().optional()
});
type PackageSchema = z.infer<typeof PackageSchema>;
const OutputSchema = z.object({
  publicPackages: z.array(PackageSchema),
  privatePackages: z.array(PackageSchema)
});
type OutputSchema = z.infer<typeof OutputSchema>;

export const registerListPackages = (server: McpServer, apiClient: ApiClient): void => {
  const name = "list_gatling_enterprise_packages";
  server.registerTool(
    name,
    {
      title: "List Packages",
      description:
        "List all packages deployed in Gatling Enterprise. Public packages are stored on Gatling Enterprise, private packages are stored on the infrastructure of the user's organization.",
      outputSchema: OutputSchema
    },
    async () => {
      analyticsOnToolCall(name);
      const packagesResponse = await apiClient.pkg.list();
      const mapPkg = (p: PackageResponse): PackageSchema => ({
        id: p.id,
        teamId: p.teamId,
        name: p.name,
        format: p.format
      });
      const structuredContent: OutputSchema = {
        publicPackages: packagesResponse.data.filter((p) => p.storageType === "public").map(mapPkg),
        privatePackages: packagesResponse.data.filter((p) => p.storageType !== "public").map(mapPkg)
      };
      return {
        content: [{ type: "text", text: JSON.stringify(structuredContent) }],
        structuredContent
      };
    }
  );
};
