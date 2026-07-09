import * as z from "zod";

import { runReadOne, runUpdateOne } from "@src/apiClientGenerated/gatlingEnterpriseComponents.js";
import { ToolCallback } from "../index.js";
import { RunRequest } from "@src/apiClientGenerated/gatlingEnterpriseSchemas.js";

export const RunSchema = z
  .object({
    title: z.string().optional(),
    description: z.string().optional()
  })
  .optional();
export type RunSchema = z.infer<typeof RunSchema>;

export const InputSchema = z.object({
  runId: z.string(),
  patch: RunSchema
});
export type InputSchema = z.infer<typeof InputSchema>;

export const OutputSchema = z.object({
  data: z.any()
});
export type OutputSchema = z.infer<typeof OutputSchema>;

export const callback: ToolCallback<InputSchema> = async ({ runId, patch }: InputSchema) => {
  const readOneResponse = await runReadOne({
    pathParams: {
      runId
    }
  });

  const body: RunRequest = {
    title: patch?.title ?? readOneResponse.data.title,
    description: patch?.description ?? readOneResponse.data.description
  };

  const response = await runUpdateOne({
    body,
    pathParams: {
      runId
    }
  });

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
