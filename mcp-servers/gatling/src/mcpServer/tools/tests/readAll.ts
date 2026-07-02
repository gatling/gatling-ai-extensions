import * as z from "zod";

import { testReadAll } from "@src/apiClientGenerated/gatlingEnterpriseComponents.js";
import { ToolCallback } from "../index.js";

export const OutputSchema = z.object({
  data: z.array(
    z.object({
      name: z.string(),
      _id: z.string(),
      _teamId: z.string(),
      _updatedAt: z.string(),
      source: z.object({
        type: z.string()
      })
    })
  )
});
export type OutputSchema = z.infer<typeof OutputSchema>;

export const callback: ToolCallback<undefined> = async (args) => {
  const response = await testReadAll({});
  const structuredContent: OutputSchema = {
    data: response.data.flatMap((item) =>
      item.source.type !== "no_code"
        ? {
            name: item.name,
            _id: item._id,
            _teamId: item._teamId,
            _updatedAt: item._updatedAt,
            source: {
              type: item.source.type
            }
          }
        : []
    )
  };
  return {
    content: [{ type: "text", text: JSON.stringify(structuredContent) }],
    structuredContent
  };
};
