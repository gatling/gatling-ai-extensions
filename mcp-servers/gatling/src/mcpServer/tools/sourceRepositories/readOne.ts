import * as z from "zod";

import { sourceRepositoryReadOne } from "@src/apiClientGenerated/gatlingEnterpriseComponents.js";
import { ToolCallback } from "../index.js";

export const InputSchema = z.object({
  sourceRepositoryId: z.string()
});
export type InputSchema = z.infer<typeof InputSchema>;

export const OutputSchema = z.object({
  data: z.any()
});
export type OutputSchema = z.infer<typeof OutputSchema>;

export const callback: ToolCallback<InputSchema> = async ({ sourceRepositoryId }: InputSchema) => {
  const response = await sourceRepositoryReadOne({ pathParams: { sourceRepositoryId } });
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
