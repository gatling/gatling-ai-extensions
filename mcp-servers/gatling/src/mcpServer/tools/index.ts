import { AnySchema, ZodRawShapeCompat } from "@modelcontextprotocol/sdk/server/zod-compat.js";
import { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import {
  ToolAnnotations,
  CallToolResult,
  ServerRequest,
  ServerNotification
} from "@modelcontextprotocol/sdk/types.js";

import * as locationsReadAll from "./locations/readAll.js";
import * as packagesReadAll from "./packages/readAll.js";
import * as runsReadAll from "./runs/readAll.js";
import * as runsReadOne from "./runs/readOne.js";
import * as runsReadReportRequests from "./runs/readReportRequests.js";
import * as runsReadReportGroups from "./runs/readReportGroups.js";
import * as runsReadRunLogs from "./runs/readRunLogs.js";
import * as runsStopOne from "./runs/stopOne.js";
import * as sourceRepositoriesCreateOne from "./sourceRepositories/createOne.js";
import * as sourceRepositoriesDeleteOne from "./sourceRepositories/deleteOne.js";
import * as sourceRepositoriesReadAll from "./sourceRepositories/readAll.js";
import * as sourceRepositoriesReadOne from "./sourceRepositories/readOne.js";
import * as teamsReadAll from "./teams/readAll.js";
import * as testsCreateOne from "./tests/createOne.js";
import * as testsDeleteOne from "./tests/deleteOne.js";
import * as testsPatchOne from "./tests/patchOne.js";
import * as testsReadAll from "./tests/readAll.js";
import * as testsReadOne from "./tests/readOne.js";
import * as testsStartOne from "./tests/startOne.js";

export const tools: Array<Tool<any, any>> = [
  // API Tokens

  // api_tokens.create_one
  // api_tokens.delete_one
  // api_tokens.patch_one
  // api_tokens.read_all
  // api_tokens.regenerate_one

  // Locations

  {
    name: "locations.read_all",
    config: {
      title: "List all the locations that can bee seen by the API token",
      description: "Require at least the Read role on any team",
      outputSchema: locationsReadAll.OutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false
      }
    },
    callback: locationsReadAll.callback
  },

  // Packages

  // packages.read_one
  // packages.create_one
  // packages.delete_one
  {
    name: "packages.read_all",
    config: {
      title: "List all the packages that can be seen by the API token",
      description:
        "Require at least the Read role on a team to see its packages; others are omitted",
      outputSchema: packagesReadAll.OutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false
      }
    },
    callback: packagesReadAll.callback
  },
  // packages.patch_one
  // packages.upload_artifact

  // Runs

  // runs.create_public_link
  // runs.patch_one
  {
    name: "runs.read_all",
    config: {
      title: "List all the Runs updated since the provided timestamp",
      description:
        "Require at least the Read role on the run's simulation's team; others are omitted",
      inputSchema: runsReadAll.InputSchema,
      outputSchema: runsReadAll.OutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false
      }
    },
    callback: runsReadAll.callback
  },
  {
    name: "runs.read_one",
    config: {
      title: "Get the details of the specified Run",
      description: "Require the Read role on the run's simulation's team",
      inputSchema: runsReadOne.InputSchema,
      outputSchema: runsReadOne.OutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false
      }
    },
    callback: runsReadOne.callback
  },
  {
    name: "runs.read_report_groups",
    config: {
      title: "Get per-group performance statistics for the specified Run",
      description: `Returns the run's top-level groups; each group nests its sub-groups in children. Stats cover the full run unless from and to are specified as offsets in seconds from the run start.
Require the Read role on the run's simulation's team.
It will return 404 if the run has no groups.`,
      inputSchema: runsReadReportGroups.InputSchema,
      outputSchema: runsReadReportGroups.OutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false
      }
    },
    callback: runsReadReportGroups.callback
  },
  {
    name: "runs.read_report_requests",
    config: {
      title: "Get per-request performance statistic for the specified Run",
      description: `Returns a tree: the root aggregates all requests, intermediate nodes are groups, and leaf nodes are individual requests. Stats cover the full run unless from and to are specified as offsets in seconds from the run start.
Require the Read role on the run's simulation's team.
It will return 404 if the run has no metrics.`,
      inputSchema: runsReadReportRequests.InputSchema,
      outputSchema: runsReadReportRequests.OutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false
      }
    },
    callback: runsReadReportRequests.callback
  },
  {
    name: "runs.read_run_logs",
    config: {
      title: "Get the logs of the specified Run",
      description: "Require the Read role on the run's simulation's team",
      inputSchema: runsReadRunLogs.InputSchema,
      outputSchema: runsReadRunLogs.OutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false
      }
    },
    callback: runsReadRunLogs.callback
  },
  {
    name: "runs.stop_one",
    config: {
      title: "Stop the specified Run",
      description: "Require the Start role on the run's simulation's team",
      inputSchema: runsStopOne.InputSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true
      }
    },
    callback: runsStopOne.callback
  },

  // SSO Groups

  // sso_groups.create_one
  // sso_groups.delete_one
  // sso_groups.read_all
  // sso_groups.patch_one
  // sso_groups.read_one

  // Source Repositories

  {
    name: "source_repositories.create_one",
    config: {
      title: "Create a new Source Repository",
      description: "Require the Configure role on the target team",
      inputSchema: sourceRepositoriesCreateOne.InputSchema,
      outputSchema: sourceRepositoriesCreateOne.OutputSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false
      }
    },
    callback: sourceRepositoriesCreateOne.callback
  },
  {
    name: "source_repositories.delete_one",
    config: {
      title: "Delete the specified Source Repository",
      description: "Require the Configure role on the source repository's team",
      inputSchema: sourceRepositoriesDeleteOne.InputSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: false
      }
    },
    callback: sourceRepositoriesDeleteOne.callback
  },
  {
    name: "source_repositories.read_all",
    config: {
      title: "List all the Source Repositories that can be seen by the API token",
      description:
        "Require at least the Read role on a team to see its source repositories; other are omitted",
      outputSchema: sourceRepositoriesReadAll.OutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false
      }
    },
    callback: sourceRepositoriesReadAll.callback
  },
  {
    name: "source_repositories.read_one",
    config: {
      title: "List all the Source Repositories that can be seen by the API token",
      description:
        "Require at least the Read role on a team to see its source repositories; others are omitted",
      inputSchema: sourceRepositoriesReadOne.InputSchema,
      outputSchema: sourceRepositoriesReadOne.OutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false
      }
    },
    callback: sourceRepositoriesReadOne.callback
  },

  // Teams

  // teams.create_one
  // teams.delete_one
  {
    name: "teams.read_all",
    config: {
      title: "List all the teams that can be seen by the API token",
      description: "Require at least the Read role on a team to see it; others are omitted",
      outputSchema: teamsReadAll.OutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false
      }
    },
    callback: teamsReadAll.callback
  },
  // teams.read_one
  // teams.read_limits
  // teams.patch_limits

  // Tests

  {
    name: "tests.create_one",
    config: {
      title: "Create a new test",
      description:
        "Require the Configure role on the team of the referenced package or source repository",
      inputSchema: testsCreateOne.InputSchema,
      outputSchema: testsCreateOne.OutputSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false
      }
    },
    callback: testsCreateOne.callback
  },
  {
    name: "tests.delete_one",
    config: {
      title: "Delete the specified test",
      description:
        "Require the Configure role on the team of the test's package or source repository",
      inputSchema: testsDeleteOne.InputSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: false
      }
    },
    callback: testsDeleteOne.callback
  },
  {
    name: "tests.patch_one",
    config: {
      title: "Patch the details of the specified test",
      description:
        "Require the Configure role on the team of the test's package or source repository",
      inputSchema: testsPatchOne.InputSchema,
      outputSchema: testsPatchOne.OutputSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: false
      }
    },
    callback: testsPatchOne.callback
  },
  {
    name: "tests.read_all",
    config: {
      title: "List all the tests that can be seen by the API token",
      description:
        "Require at least the Read role on the team of the test's package or source repository; others are omitted",
      outputSchema: testsReadAll.OutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false
      }
    },
    callback: testsReadAll.callback
  },
  {
    name: "tests.read_one",
    config: {
      title: "Get the details of the specified test",
      description: "Require the Read role on the team of the test's package or source repository",
      inputSchema: testsReadOne.InputSchema,
      outputSchema: testsReadOne.OutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false
      }
    },
    callback: testsReadOne.callback
  },
  {
    name: "tests.start_one",
    config: {
      title: "Start a run for the specified test",
      description: "Require the Start role on the team of the test's package or source repository",
      inputSchema: testsStartOne.InputSchema,
      outputSchema: testsStartOne.OutputSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true
      }
    },
    callback: testsStartOne.callback
  }

  // Users

  // users.create_one
  // users.delete_one
  // users.patch_one
  // users.read_all
  // users.read_one
];

export type ToolCallback<InputArgs> = (
  args: InputArgs,
  extra: RequestHandlerExtra<ServerRequest, ServerNotification>
) => Promise<CallToolResult>;

export interface Tool<
  OutputArgs extends ZodRawShapeCompat | AnySchema,
  InputArgs extends undefined | ZodRawShapeCompat | AnySchema = undefined
> {
  name: string;
  config: {
    title?: string;
    description?: string;
    inputSchema?: InputArgs;
    outputSchema?: OutputArgs;
    annotations?: ToolAnnotations;
    _meta?: Record<string, unknown>;
  };
  callback: ToolCallback<InputArgs>;
}
