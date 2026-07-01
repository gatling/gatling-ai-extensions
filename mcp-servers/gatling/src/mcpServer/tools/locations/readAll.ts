import * as z from "zod";

import { locationReadAll } from "@src/apiClientGenerated/gatlingEnterpriseComponents.js";
import { ToolCallback } from "../index.js";
import {
  LocationItemResponse,
  ManagedLocationItemResponse,
  PrivateLocationItemResponse
} from "@src/apiClientGenerated/gatlingEnterpriseSchemas.js";

export const OutputSchema = z.object({
  managedLocations: z.array(z.string()),
  privateLocations: z.array(
    z.object({
      id: z.string(),
      artifactFormats: z.array(z.string()),
      description: z.string().optional()
    })
  )
});
export type OutputSchema = z.infer<typeof OutputSchema>;

export const callback: ToolCallback<undefined> = async () => {
  const response = await locationReadAll({});
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
};

const isPrivateLocation = (
  location: LocationItemResponse
): location is PrivateLocationItemResponse => location._type === "private_location";

const isManagedLocation = (
  location: LocationItemResponse
): location is ManagedLocationItemResponse => location._type === "managed_location";
