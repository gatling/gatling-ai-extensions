import * as z from "zod";

import { testReadOne } from "@src/apiClientGenerated/gatlingEnterpriseComponents.js";
import { ToolCallback } from "../index.js";

export const InputSchema = z.object({
  testId: z.string()
});
export type InputSchema = z.infer<typeof InputSchema>;

export const OutputSchema = z.object({
  data: z.any()
});
export type OutputSchema = z.infer<typeof OutputSchema>;

export const callback: ToolCallback<InputSchema> = async ({ testId }: InputSchema) => {
  const response = await testReadOne({ pathParams: { testId } });
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
