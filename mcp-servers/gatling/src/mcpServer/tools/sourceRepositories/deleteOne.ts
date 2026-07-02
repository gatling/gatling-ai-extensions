import * as z from "zod";

import { sourceRepositoryDeleteOne } from "@src/apiClientGenerated/gatlingEnterpriseComponents.js";
import { ToolCallback } from "../index.js";

export const InputSchema = z.object({
  sourceRepositoryId: z.string()
});
export type InputSchema = z.infer<typeof InputSchema>;

export const callback: ToolCallback<InputSchema> = async ({ sourceRepositoryId }: InputSchema) => {
  await sourceRepositoryDeleteOne({ pathParams: { sourceRepositoryId } });
  return {
    content: [{ type: "text", text: "Source repository successfully deleted" }]
  };
};
