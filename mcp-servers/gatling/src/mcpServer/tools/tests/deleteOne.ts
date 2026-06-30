import * as z from "zod";

import { apiClient } from "@src/apiClient/index.js";
import { ToolCallback } from "../index.js";

export const InputSchema = z.object({
  testId: z.string()
});
export type InputSchema = z.infer<typeof InputSchema>;

export const callback: ToolCallback<InputSchema> = async ({ testId }: InputSchema) => {
  await apiClient.tests.deleteOne(testId);
  return {
    content: [{ type: "text", text: "Test successfully deleted" }]
  };
};
