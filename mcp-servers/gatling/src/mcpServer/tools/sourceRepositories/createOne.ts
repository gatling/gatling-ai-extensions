import * as z from "zod";

import { sourceRepositoryCreateOne } from "@src/apiClientGenerated/gatlingEnterpriseComponents.js";
import { ToolCallback } from "../index.js";

export const InputSchema = z.object({
  name: z.string(),
  teamId: z.string(),
  remote: z.object({
    url: z.string()
  })
});
export type InputSchema = z.infer<typeof InputSchema>;

export const OutputSchema = z.object({
  data: z.any()
});
export type OutputSchema = z.infer<typeof OutputSchema>;

export const callback: ToolCallback<InputSchema> = async (args: InputSchema) => {
  const response = await sourceRepositoryCreateOne({ body: args });
  const structuredContent: OutputSchema = {
    data: {
      ...response.data
    }
  };
  return {
    content: [{ type: "text", text: JSON.stringify(structuredContent) }],
    structuredContent
  };
};
