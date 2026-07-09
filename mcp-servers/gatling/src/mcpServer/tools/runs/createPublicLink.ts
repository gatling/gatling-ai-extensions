import * as z from "zod";

import { runPublicLinkCreateOne } from "@src/apiClientGenerated/gatlingEnterpriseComponents.js";
import { ToolCallback } from "../index.js";

export const InputSchema = z.object({
  runId: z.string(),
  durationInDays: z.number()
});
export type InputSchema = z.infer<typeof InputSchema>;

export const OutputSchema = z.object({
  url: z.string(),
  expiresAt: z.string()
});
export type OutputSchema = z.infer<typeof OutputSchema>;

export const callback: ToolCallback<InputSchema> = async ({
  runId,
  durationInDays
}: InputSchema) => {
  const response = await runPublicLinkCreateOne({
    body: {
      durationInDays
    },
    pathParams: {
      runId
    }
  });

  const structuredContent: OutputSchema = {
    url: response.url,
    expiresAt: response.expiresAt
  };

  return {
    content: [{ type: "text", text: JSON.stringify(structuredContent) }],
    structuredContent
  };
};
