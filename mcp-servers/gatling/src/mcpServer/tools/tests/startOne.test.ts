import { mcpToolCall } from "@src/index.test.js";

const testsStartOneArgs = {
  testId: "test_85oi617ymtnz3ctq76thr9pyey",
  title: "run title from jest",
  description: "run description from jest"
};

const insufficientCreditsTestsStartOneArgs = {
  testId: "test_i1trqrufttbajk335nmi3kzd1w",
  title: "run title from jest",
  description: "run description from jest"
};

describe("tests.start_one", () => {
  it("should fail when called with an api token with insufficient permissions", async () => {
    const result = await mcpToolCall({
      tool: "tests.start_one",
      apiToken: "read",
      args: testsStartOneArgs
    });

    expect(result).toEqual({
      content: [
        {
          text: "POST /v2/tests/{testId}/runs returned status 403: the API token does not have sufficient privileges",
          type: "text"
        }
      ],
      isError: true
    });
  });
  it("should fail when called within a team that has insufficient credits", async () => {
    const result = await mcpToolCall({
      tool: "tests.start_one",
      apiToken: "start",
      args: insufficientCreditsTestsStartOneArgs
    });

    expect(result).toEqual({
      content: [
        {
          text: "POST /v2/tests/{testId}/runs returned status 409: Insufficient credits",
          type: "text"
        }
      ],
      isError: true
    });
  });
  it("should fail when called with partial inputs", async () => {
    const { testId: _, ...partialTestsStartOneArgs } = testsStartOneArgs;
    const result = await mcpToolCall({
      tool: "tests.start_one",
      apiToken: "start",
      args: partialTestsStartOneArgs
    });

    expect(result).toEqual({
      content: [
        {
          text: 'MCP error -32602: Input validation error: Invalid arguments for tool tests.start_one: [\n  {\n    "expected": "string",\n    "code": "invalid_type",\n    "path": [\n      "testId"\n    ],\n    "message": "Invalid input: expected string, received undefined"\n  }\n]',
          type: "text"
        }
      ],
      isError: true
    });
  });
  it("should succeed with proper inputs", async () => {
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
              simulation: "[R&D] dummy test",
              testId: testsStartOneArgs.testId
            }),
            description: testsStartOneArgs.description,
            title: testsStartOneArgs.title
          }),
          metadata: {
            urls: {
              run: expect.stringMatching(
                `^https://cloud.dev.gatling.io/o/testing-hour-rd/simulations/${testsStartOneArgs.testId}/runs/run_[a-z0-9]+$`
              )
            }
          }
        })
      })
    );
  });
});
