import * as z from "zod";

import { testStartOne } from "@src/apiClientGenerated/gatlingEnterpriseComponents.js";
import { ToolCallback } from "../index.js";

export const InputSchema = z.object({
  testId: z.string(),
  title: z.string().optional(),
  description: z.string().optional()
});
export type InputSchema = z.infer<typeof InputSchema>;

export const OutputSchema = z.object({
  data: z.any(),
  metadata: z.any()
});
export type OutputSchema = z.infer<typeof OutputSchema>;

export const callback: ToolCallback<InputSchema> = async ({
  testId,
  title,
  description
}: InputSchema) => {
  const response = await testStartOne({
    body: { title, description },
    pathParams: { testId }
  });
  const structuredContent: OutputSchema = {
    data: {
      ...response.data
    },
    metadata: {
      ...response.metadata
    }
  };
  return {
    content: [{ type: "text", text: JSON.stringify(structuredContent) }],
    structuredContent
  };
};
