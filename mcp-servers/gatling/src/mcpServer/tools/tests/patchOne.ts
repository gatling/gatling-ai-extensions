import * as z from "zod";

import { testReadOne, testUpdateOne } from "@src/apiClientGenerated/gatlingEnterpriseComponents.js";
import {
  DistributionDto,
  ExecutionDto,
  SourceDetails,
  TestRequest
} from "@src/apiClientGenerated/gatlingEnterpriseSchemas.js";
import { ToolCallback } from "../index.js";

export const LoadGeneratorSchema = z.object({
  locationId: z.string(),
  instance: z.object({
    count: z.number().gte(1)
  }),
  loadPercentage: z.number().optional()
});
export type LoadGeneratorSchema = z.infer<typeof LoadGeneratorSchema>;

export const ExecutionSchema = z.object({
  meaningfulTimeWindow: z
    .object({
      rampUpSeconds: z.number().optional(),
      rampDownSeconds: z.number().optional()
    })
    .optional(),
  systemProperties: z.record(z.string(), z.string()).optional(),
  environmentVariables: z.record(z.string(), z.string()).optional(),
  ignoreGlobalProperties: z.boolean().optional(),
  stopCriteria: z
    .array(
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
    .optional()
});
export type ExecutionSchema = z.infer<typeof ExecutionSchema>;

export const BuildCommandSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("maven")
  }),
  z.object({
    type: z.literal("maven-wrapper")
  }),
  z.object({
    type: z.literal("gradle")
  }),
  z.object({
    type: z.literal("gradle-wrapper")
  }),
  z.object({
    type: z.literal("sbt")
  }),
  z.object({
    type: z.literal("npm")
  }),
  z.object({
    type: z.literal("custom"),
    command: z.string(),
    packageFormat: z.string()
  })
]);
export type BuildCommandSchema = z.infer<typeof BuildCommandSchema>;

export const SourceDetailsSchema = z.union([
  z.object({
    type: z.literal("build_from_sources").optional(),
    sourceRepositoryId: z.string().optional(),
    buildTool: BuildCommandSchema.optional(),
    simulation: z.string().optional(),
    workingDirectory: z.string().nullable().optional(),
    branch: z.string().nullable().optional()
  }),
  z.object({
    type: z.literal("packaged").optional(),
    packageId: z.string().optional(),
    simulation: z.string().optional()
  }),
  z.object({
    type: z.literal("no_code").optional(),
    teamId: z.string().optional()
  })
]);
export type SourceDetailsSchema = z.infer<typeof SourceDetailsSchema>;

export const TestSchema = z.object({
  name: z.string().optional(),
  distribution: z
    .object({
      loadGenerators: z.array(LoadGeneratorSchema)
    })
    .optional(),
  execution: ExecutionSchema.optional(),
  source: SourceDetailsSchema.optional()
});
export type TestSchema = z.infer<typeof TestSchema>;

export const InputSchema = z.object({
  testId: z.string(),
  patch: TestSchema
});
export type InputSchema = z.infer<typeof InputSchema>;

export const OutputSchema = z.object({
  data: z.any()
});
export type OutputSchema = z.infer<typeof OutputSchema>;

const patchField = <T>(patch: T | undefined | null, currentValue: T | undefined): T | undefined =>
  patch === null ? undefined : (patch ?? currentValue);

export const callback: ToolCallback<InputSchema> = async ({ testId, patch }: InputSchema) => {
  const readOneResponse = await testReadOne({
    pathParams: {
      testId
    }
  });

  const distribution: DistributionDto = readOneResponse.data.distribution;
  const patchedDistribution: DistributionDto = {
    loadGenerators: patch.distribution?.loadGenerators ?? distribution.loadGenerators
  };

  const execution: ExecutionDto = readOneResponse.data.execution;
  const patchedExecution: ExecutionDto = {
    meaningfulTimeWindow: {
      rampUpSeconds:
        patch.execution?.meaningfulTimeWindow?.rampUpSeconds ??
        execution.meaningfulTimeWindow.rampUpSeconds,
      rampDownSeconds:
        patch.execution?.meaningfulTimeWindow?.rampDownSeconds ??
        execution.meaningfulTimeWindow.rampDownSeconds
    },
    systemProperties: patch.execution?.systemProperties ?? execution.systemProperties,
    environmentVariables: patch.execution?.environmentVariables ?? execution.environmentVariables,
    ignoreGlobalProperties:
      patch.execution?.ignoreGlobalProperties ?? execution.ignoreGlobalProperties,
    stopCriteria: patch.execution?.stopCriteria ?? execution.stopCriteria
  };

  const source: SourceDetails = readOneResponse.data.source;
  let patchedSource: SourceDetails;
  if (patch.source?.type === "build_from_sources" && source.type === "build_from_sources") {
    patchedSource = {
      type: "build_from_sources",
      sourceRepositoryId: patch.source?.sourceRepositoryId ?? source.sourceRepositoryId,
      buildTool: patch.source?.buildTool ?? source.buildTool,
      simulation: patch.source?.simulation ?? source.simulation,
      workingDirectory: patchField(patch.source?.workingDirectory, source.workingDirectory),
      branch: patchField(patch.source?.branch, source.branch)
    };
    // TODO packages
    // TODO no_code
  } else if (typeof patch.source === "undefined") {
    patchedSource = source;
  } else {
    throw Error("don't do that");
  }

  const body: TestRequest = {
    name: patch.name ?? readOneResponse.data.name,
    distribution: patchedDistribution,
    execution: patchedExecution,
    source: patchedSource
  };

  const response = await testUpdateOne({
    body,
    pathParams: {
      testId
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
