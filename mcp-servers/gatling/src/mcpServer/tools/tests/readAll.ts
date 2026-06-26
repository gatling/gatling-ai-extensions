import * as z from "zod";

import { apiClient } from "../../../apiClient/index.js";
import { ToolCallback } from "../index.js";

export const OutputSchema = z.object({
  data: z.array(
    z.object({
      name: z.string(),
      _id: z.string(),
      _teamId: z.string(),
      _updatedAt: z.string(),
      source: z.object({
        type: z.string() // FIXME ???
      })
    })
  )
});
export type OutputSchema = z.infer<typeof OutputSchema>;

export const callback: ToolCallback<undefined> = async (args) => {
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
};
