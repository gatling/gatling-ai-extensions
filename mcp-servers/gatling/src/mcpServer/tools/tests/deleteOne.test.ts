import { mcpToolCall } from "@src/index.test.js";

import { createOneArgs } from "@src/__tests__/fixtures/tests.js";

let testId: string;

describe("tests.delete_one", () => {
  beforeAll(async () => {
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
  it("should fail when called with an api token with insufficient permissions", async () => {
    const result = await mcpToolCall({
      tool: "tests.delete_one",
      apiToken: "start",
      args: {
        testId
      }
    });

    expect(result).toEqual({
      content: [
        {
          text: "DELETE /v2/tests/{testId} returned status 403: the API token does not have sufficient privileges",
          type: "text"
        }
      ],
      isError: true
    });
  });
  it("should successfully delete one test", async () => {
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
