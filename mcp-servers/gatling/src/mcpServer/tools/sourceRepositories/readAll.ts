import * as z from "zod";

import { sourceRepositoryReadAll } from "@src/apiClientGenerated/gatlingEnterpriseComponents.js";
import { ToolCallback } from "../index.js";

export const OutputSchema = z.object({
  data: z.array(
    z.object({
      name: z.string(),
      _id: z.string()
    })
  )
});
export type OutputSchema = z.infer<typeof OutputSchema>;

export const callback: ToolCallback<undefined> = async (args) => {
  const response = await sourceRepositoryReadAll();
  const structuredContent: OutputSchema = {
    data: response.data.map((item) => ({
      name: item.name,
      _id: item._id
    }))
  };
  return {
    content: [{ type: "text", text: JSON.stringify(structuredContent) }],
    structuredContent
  };
};
