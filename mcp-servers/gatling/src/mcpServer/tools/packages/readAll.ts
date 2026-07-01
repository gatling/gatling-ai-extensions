import * as z from "zod";

import { packageReadAll } from "@src/apiClientGenerated/gatlingEnterpriseComponents.js";
import { PackageItemResponse } from "@src/apiClientGenerated/gatlingEnterpriseSchemas.js";
import { ToolCallback } from "../index.js";

export const PackageSchema = z.object({
  name: z.string(),
  teamId: z.string(),
  _id: z.string(),
  _format: z.string().optional()
});
export type PackageSchema = z.infer<typeof PackageSchema>;

export const OutputSchema = z.object({
  managedPackages: z.array(PackageSchema),
  privatePackages: z.array(PackageSchema)
});
export type OutputSchema = z.infer<typeof OutputSchema>;

export const callback: ToolCallback<undefined> = async () => {
  const response = await packageReadAll();
  const mapItem = (item: PackageItemResponse): PackageSchema => ({
    name: item.name,
    teamId: item.teamId,
    _id: item._id,
    _format: item._storage.artifact?.format
  });
  const structuredContent: OutputSchema = {
    managedPackages: response.data.filter((item) => item._storage.type === "managed").map(mapItem),
    privatePackages: response.data.filter((item) => item._storage.type === "private").map(mapItem)
  };
  return {
    content: [{ type: "text", text: JSON.stringify(structuredContent) }],
    structuredContent
  };
};
