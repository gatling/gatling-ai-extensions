import { mcpToolCall } from "@src/index.test.js";

let runId: string;
const testsStartOneArgs = {
  testId: "test_85oi617ymtnz3ctq76thr9pyey",
  title: "stoppable run title from jest",
  description: "stoppable run description from jest",
  extra: {
    systemProperties: {
      duration: "60"
    }
  }
};

describe("runs.stop_one", () => {
  beforeAll(async () => {
    const result = await mcpToolCall({
      tool: "tests.start_one",
      apiToken: "start",
      args: testsStartOneArgs
    });

    expect(result).toEqual(
      expect.objectContaining({
        structuredContent: expect.objectContaining({
          data: expect.objectContaining({
            _configuration: expect.objectContaining({
              systemProperties: {
                duration: "60"
              }
            }),
            _id: expect.stringMatching("run_[a-z0-9]+"),
            _type: "run",
            description: "stoppable run description from jest",
            title: "stoppable run title from jest"
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

    expect(result).toEqual({
      content: [
        {
          text: "POST /v2/tests/{runId}/actions/stop returned status 403: the API token does not have sufficient privileges",
          type: "text"
        }
      ],
      isError: true
    });
  });
  it("should succeed with proper inputs", async () => {
    const result = await mcpToolCall({
      tool: "runs.stop_one",
      apiToken: "start",
      args: {
        runId
      }
    });

    expect(result).toEqual({
      content: [
        {
          text: "Test successfully stopped",
          type: "text"
        }
      ]
    });
  });
});
