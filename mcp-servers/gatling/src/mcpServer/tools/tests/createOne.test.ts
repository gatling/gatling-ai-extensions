import { mcpToolCall } from "@src/index.test.js";

import { createOneArgs } from "@src/__tests__/fixtures/tests.js";

let testId: string;

describe("tests.create_one", () => {
  it("should fail when called with an api token with insufficient permissions", async () => {
    const result = await mcpToolCall({
      tool: "tests.create_one",
      apiToken: "start",
      args: createOneArgs
    });

    expect(result).toEqual({
      content: [
        {
          text: "POST /v2/tests returned status 403: the API token does not have sufficient privileges",
          type: "text"
        }
      ],
      isError: true
    });
  });
  it("should fail when called with partial inputs", async () => {
    const { execution: _, ...partialCreateOneArgs } = createOneArgs;
    const result = await mcpToolCall({
      tool: "tests.create_one",
      apiToken: "configure",
      args: partialCreateOneArgs
    });

    expect(result).toEqual({
      content: [
        {
          text: `MCP error -32602: Input validation error: Invalid arguments for tool tests.create_one: [
  {
    "expected": "object",
    "code": "invalid_type",
    "path": [
      "execution"
    ],
    "message": "Invalid input: expected object, received undefined"
  }
]`,
          type: "text"
        }
      ],
      isError: true
    });
  });
});

describe("tests.create_one", () => {
  it("should succeed with proper inputs", async () => {
    const result = await mcpToolCall({
      tool: "tests.create_one",
      apiToken: "configure",
      args: createOneArgs
    });

    expect(result).toEqual(
      expect.objectContaining({
        structuredContent: expect.objectContaining({
          data: expect.objectContaining({
            name: createOneArgs.name,
            _id: expect.stringMatching("test_[a-z0-9]+"),
            _type: "test"
          })
        })
      })
    );

    // @ts-ignore
    testId = result.structuredContent.data._id;
    console.log("Created test with Id", testId);
  });
  afterAll(async () => {
    const result = await mcpToolCall({
      tool: "tests.delete_one",
      apiToken: "configure",
      args: {
        testId
      }
    });

    expect(result).toEqual({
      content: [
        {
          text: "Test successfully deleted",
          type: "text"
        }
      ]
    });
  });
});
