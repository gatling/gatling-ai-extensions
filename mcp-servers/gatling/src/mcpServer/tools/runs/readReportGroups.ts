import * as z from "zod";

import { runViewReadReportGroups } from "@src/apiClientGenerated/gatlingEnterpriseComponents.js";
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

export const callback: ToolCallback<InputSchema> = async ({ runId }: InputSchema) => {
  const response = await runViewReadReportGroups({
    pathParams: {
      runId
    }
  });
  const structuredContent: OutputSchema = response;
  return {
    content: [{ type: "text", text: JSON.stringify(structuredContent) }],
    structuredContent
  };
};
