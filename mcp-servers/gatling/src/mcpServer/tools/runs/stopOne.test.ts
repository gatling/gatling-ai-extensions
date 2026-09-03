import { mcpToolCall } from "@src/index.test.js";

import { startOneArgs } from "@src/__tests__/fixtures/tests.js";

let runId: string;

describe("runs.stop_one", () => {
  beforeAll(async () => {
    const result = await mcpToolCall({
      tool: "tests.start_one",
      apiToken: "start",
      args: startOneArgs
    });

    expect(result).toEqual(
      expect.objectContaining({
        structuredContent: expect.objectContaining({
          data: expect.objectContaining({
            _configuration: expect.objectContaining({
              systemProperties: {
                duration: startOneArgs.extra.systemProperties.duration
              }
            }),
            _id: expect.stringMatching("run_[a-z0-9]+"),
            _type: "run",
            description: startOneArgs.description,
            title: startOneArgs.title
          })
        })
      })
    );

    // @ts-ignore
    runId = result.structuredContent.data._id;
    console.log("Started run with Id", runId);
  });
  it("should fail when called with an api token with insufficient permissions", async () => {
    const result = await mcpToolCall({
      tool: "runs.stop_one",
      apiToken: "read",
      args: {
        runId
      }
    });

    expect(result).toEqual(
      expect.objectContaining({
        content: [
          {
            text: "POST /v2/runs/{runId}/actions/stop returned status 403: the API token does not have sufficient privileges",
            type: "text"
          }
        ],
        isError: true
      })
    );
  });
  it("should succeed with proper inputs", async () => {
    const result = await mcpToolCall({
      tool: "runs.stop_one",
      apiToken: "start",
      args: {
        runId
      }
    });

    expect(result).toEqual(
      expect.objectContaining({
        content: [
          {
            text: "Test successfully stopped",
            type: "text"
          }
        ]
      })
    );
  });
});
