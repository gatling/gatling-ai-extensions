import { mcpToolCall } from "@src/index.test.js";

import tests from "@src/__tests__/fixtures/tests.js";

const testId = tests.dummy._id;
const runId = tests.dummy.runs.read._id;

describe("runs.create_public_link", () => {
  it("should fail when called with an api token with insufficient permissions", async () => {
    const result = await mcpToolCall({
      tool: "runs.create_public_link",
      apiToken: "read",
      args: {
        runId,
        durationInDays: 1
      }
    });

    expect(result).toEqual({
      content: [
        {
          text: "POST /v2/runs/{runId}/actions/create-public-link returned status 403: the API token does not have sufficient privileges",
          type: "text"
        }
      ],
      isError: true
    });
  });
  it("should fail when called with partial inputs", async () => {
    const result = await mcpToolCall({
      tool: "runs.create_public_link",
      apiToken: "start",
      args: {
        runId
      }
    });

    expect(result).toEqual({
      content: [
        {
          text: `MCP error -32602: Input validation error: Invalid arguments for tool runs.create_public_link: [
  {
    "expected": "number",
    "code": "invalid_type",
    "path": [
      "durationInDays"
    ],
    "message": "Invalid input: expected number, received undefined"
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
      tool: "runs.create_public_link",
      apiToken: "start",
      args: {
        runId,
        durationInDays: 1
      }
    });

    expect(result).toEqual(
      expect.objectContaining({
        structuredContent: {
          url: expect.stringMatching(
            `https://[a-z.]+/o/[a-z-]+/public/[a-z0-9]+/simulations/${testId}/runs/${runId}`
          ),
          expiresAt: expect.stringMatching(
            "[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3,6}Z"
          )
        }
      })
    );
  });
});
