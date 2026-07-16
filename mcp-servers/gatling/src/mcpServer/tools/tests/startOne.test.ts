import { mcpToolCall } from "@src/index.test.js";

import runs from "@src/__tests__/fixtures/runs.js";
import tests from "@src/__tests__/fixtures/tests.js";

const startOneArgs = {
  testId: tests.dummy._id,
  ...runs.metadata.static
};

const insufficientCreditsStartOneArgs = {
  testId: tests.creditless._id,
  ...runs.metadata.static
};

describe("tests.start_one", () => {
  it("should fail when called with an api token with insufficient permissions", async () => {
    const result = await mcpToolCall({
      tool: "tests.start_one",
      apiToken: "read",
      args: startOneArgs
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
      args: insufficientCreditsStartOneArgs
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
    const { testId: _, ...partialStartOneArgs } = startOneArgs;
    const result = await mcpToolCall({
      tool: "tests.start_one",
      apiToken: "start",
      args: partialStartOneArgs
    });

    expect(result).toEqual({
      content: [
        {
          text: `MCP error -32602: Input validation error: Invalid arguments for tool tests.start_one: [
  {
    "expected": "string",
    "code": "invalid_type",
    "path": [
      "testId"
    ],
    "message": "Invalid input: expected string, received undefined"
  }
]`,
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
      args: startOneArgs
    });

    expect(result).toEqual(
      expect.objectContaining({
        structuredContent: expect.objectContaining({
          data: expect.objectContaining({
            _configuration: expect.objectContaining({
              simulation: tests.dummy.name,
              testId: startOneArgs.testId
            }),
            description: startOneArgs.description,
            title: startOneArgs.title
          }),
          metadata: {
            urls: {
              run: expect.stringMatching(
                `^https://cloud.dev.gatling.io/o/testing-hour-rd/simulations/${startOneArgs.testId}/runs/run_[a-z0-9]+$`
              )
            }
          }
        })
      })
    );
  });
});
