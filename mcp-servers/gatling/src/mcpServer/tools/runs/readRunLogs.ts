import * as z from "zod";

import { apiClient } from "../../../apiClient/index.js";
import { ToolCallback } from "../index.js";

export const InputSchema = z.object({
  runId: z.string()
});
export type InputSchema = z.infer<typeof InputSchema>;

export const OutputSchema = z.object({
  data: z.any()
});
export type OutputSchema = z.infer<typeof OutputSchema>;

export const callback: ToolCallback<InputSchema> = async ({ runId }: InputSchema) => {
  const structuredContent: OutputSchema = await apiClient.runs.readRunLogs(runId);
  return {
    content: [{ type: "text", text: JSON.stringify(structuredContent) }],
    structuredContent
  };
};
