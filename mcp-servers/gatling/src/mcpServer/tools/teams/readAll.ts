import * as z from "zod";

import { apiClient } from "../../../apiClient/index.js";
import { ToolCallback } from "../index.js";

export const OutputSchema = z.object({
  data: z.array(
    z.object({
      name: z.string(),
      _id: z.string(),
      _limits: z.object({
        credits: z
          .object({
            quota: z.number()
          })
          .optional()
      }),
      _creditsUsed: z.number()
    })
  )
});
export type OutputSchema = z.infer<typeof OutputSchema>;

export const callback: ToolCallback<undefined> = async () => {
  const response = await apiClient.teams.readAll();
  const structuredContent: OutputSchema = {
    data: response.data.map((item) => ({
      name: item.name,
      _id: item._id,
      _limits: item._limits.credits
        ? {
            credits: {
              quota: item._limits.credits?.quota
            }
          }
        : {},
      _creditsUsed: item._creditsUsed
    }))
  };
  return {
    content: [{ type: "text", text: JSON.stringify(structuredContent) }],
    structuredContent
  };
};
