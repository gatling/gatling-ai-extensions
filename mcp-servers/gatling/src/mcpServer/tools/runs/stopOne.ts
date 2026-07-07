import * as z from "zod";

import { runStopOne } from "@src/apiClientGenerated/gatlingEnterpriseComponents.js";
import { ToolCallback } from "../index.js";

export const InputSchema = z.object({
  runId: z.string()
});
export type InputSchema = z.infer<typeof InputSchema>;

export const callback: ToolCallback<InputSchema> = async ({ runId }: InputSchema) => {
  await runStopOne({
    pathParams: { runId }
  });
  return {
    content: [{ type: "text", text: "Test successfully stopped" }]
  };
};
