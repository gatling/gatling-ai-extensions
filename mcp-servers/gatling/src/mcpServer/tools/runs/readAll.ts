import * as z from "zod";

import {
  RunReadAllQueryParams,
  runReadAll
} from "@src/apiClientGenerated/gatlingEnterpriseComponents.js";
import { ToolCallback } from "../index.js";

export const InputSchema = z.object({
  updatedAt: z.string().describe("Defaults to 24h, format: YYYY-MM-ddThh:mm:ss.sssZ").optional(),
  limit: z.number().gte(1).default(10).optional(),
  testId: z.array(z.string()).optional()
});
export type InputSchema = z.infer<typeof InputSchema>;

export const OutputSchema = z.object({
  data: z.array(
    z.object({
      title: z.string().optional(),
      _id: z.string(),
      _status: z.string(),
      _updatedAt: z.string(),
      _configuration: z.object({
        testId: z.string(),
        incrementalId: z.number()
      })
    })
  ),
  metadata: z.any()
});
export type OutputSchema = z.infer<typeof OutputSchema>;

export const callback: ToolCallback<InputSchema> = async ({ updatedAt, limit, testId }) => {
  const queryParams: RunReadAllQueryParams = { limit };
  if (updatedAt !== undefined) {
    queryParams["updated-at_gt"] = updatedAt;
  }
  if (testId !== undefined) {
    queryParams["test-id"] = testId;
  }

  const response = await runReadAll({ queryParams });
  const structuredContent: OutputSchema = {
    data: response.data.map((item) => ({
      title: item.title,
      _id: item._id,
      _status: item._status,
      _updatedAt: item._updatedAt,
      _configuration: {
        testId: item._configuration.testId,
        incrementalId: item._configuration.incrementalId
      }
    })),
    metadata: response.metadata
  };
  return {
    content: [{ type: "text", text: JSON.stringify(structuredContent) }],
    structuredContent
  };
};
