import * as z from "zod";

import { ApiClient } from "../../../apiClient/index.js";
import { ToolCallback } from "../index.js";

export const InputSchema = z.object({
  runId: z.string()
});
export type InputSchema = z.infer<typeof InputSchema>;

export const OutputSchema = z.object({
  data: z.any(),
  metadata: z.any()
});
export type OutputSchema = z.infer<typeof OutputSchema>;

export const callback =
  (apiClient: ApiClient): ToolCallback<InputSchema> =>
  async ({ runId }: InputSchema) => {
    const response = await apiClient.runs.readReportRequests(runId);
    const structuredContent: OutputSchema = response;
    return {
      content: [{ type: "text", text: JSON.stringify(structuredContent) }],
      structuredContent
    };
  };
