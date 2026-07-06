import * as z from "zod";

import { testCreateOne } from "@src/apiClientGenerated/gatlingEnterpriseComponents.js";
import { ToolCallback } from "../index.js";

export const LoadGeneratorSchema = z.object({
  locationId: z.string().describe("Managed location name or private location ID"),
  instance: z.object({
    count: z.number().gte(1)
  }),
  loadPercentage: z.number().optional()
});
export type LoadGeneratorSchema = z.infer<typeof LoadGeneratorSchema>;

export const ExecutionSchema = z.object({
  meaningfulTimeWindow: z.object({
    rampUpSeconds: z.number(),
    rampDownSeconds: z.number()
  }),
  systemProperties: z.record(z.string(), z.string()),
  environmentVariables: z.record(z.string(), z.string()),
  ignoreGlobalProperties: z.boolean(),
  stopCriteria: z.array(
    z.discriminatedUnion("type", [
      z.object({
        type: z.literal("meanCpu"),
        timeframeInSeconds: z.number(),
        threshold: z.object({
          maxPercentage: z.number()
        })
      }),
      z.object({
        type: z.literal("globalErrorRatio"),
        timeframeInSeconds: z.number(),
        threshold: z.object({
          maxPercentage: z.number()
        })
      }),
      z.object({
        type: z.literal("globalResponseTime"),
        timeframeInSeconds: z.number(),
        threshold: z.object({
          percentile: z.number(),
          maxMilliseconds: z.number()
        })
      })
    ])
  )
});
export type ExecutionSchema = z.infer<typeof ExecutionSchema>;

export const BuildCommandSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal(["maven", "maven-wrapper", "gradle", "gradle-wrapper", "sbt", "npm"])
  }),
  z.object({
    type: z.literal("custom"),
    command: z.string(),
    packageFormat: z.string()
  })
]);
export type BuildCommandSchema = z.infer<typeof BuildCommandSchema>;

export const SourceDetailsSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("build_from_sources"),
    sourceRepositoryId: z.string(),
    buildTool: BuildCommandSchema,
    simulation: z.string(),
    workingDirectory: z.string().optional(),
    branch: z.string().optional()
  }),
  z.object({
    type: z.literal("packaged"),
    packageId: z.string(),
    simulation: z.string()
  })
]);
export type SourceDetailsSchema = z.infer<typeof SourceDetailsSchema>;

export const InputSchema = z.object({
  name: z.string(),
  distribution: z.object({
    loadGenerators: z.array(LoadGeneratorSchema)
  }),
  execution: ExecutionSchema,
  source: SourceDetailsSchema
});
export type InputSchema = z.infer<typeof InputSchema>;

export const OutputSchema = z.object({
  data: z.any()
});
export type OutputSchema = z.infer<typeof OutputSchema>;

export const callback: ToolCallback<InputSchema> = async (args: InputSchema) => {
  const response = await testCreateOne({ body: args });
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
