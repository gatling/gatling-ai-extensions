import * as z from "zod";

import { testDeleteOne } from "@src/apiClientGenerated/gatlingEnterpriseComponents.js";
import { ToolCallback } from "../index.js";

export const InputSchema = z.object({
  testId: z.string()
});
export type InputSchema = z.infer<typeof InputSchema>;

export const callback: ToolCallback<InputSchema> = async ({ testId }: InputSchema) => {
  await testDeleteOne({ pathParams: { testId } });
  return {
    content: [{ type: "text", text: "Test successfully deleted" }]
  };
};
