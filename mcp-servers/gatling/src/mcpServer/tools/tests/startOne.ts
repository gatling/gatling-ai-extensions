import * as z from "zod";

import { apiClient } from "../../../apiClient/index.js";
import { ToolCallback } from "../index.js";

export const InputSchema = z.object({
  testId: z.string()
});
export type InputSchema = z.infer<typeof InputSchema>;

export const OutputSchema = z.object({
  data: z.any(),
  metadata: z.any()
});
export type OutputSchema = z.infer<typeof OutputSchema>;

export const callback: ToolCallback<InputSchema> = async ({ testId }: InputSchema) => {
  const response = await apiClient.tests.startOne(testId);
  const structuredContent: OutputSchema = response;
  return {
    content: [{ type: "text", text: JSON.stringify(structuredContent) }],
    structuredContent
  };
};
