import { mcpToolCall } from "@src/index.test.js";

import tests from "@src/__tests__/fixtures/tests.js";

const test = tests.dummy;

describe("tests.read_one", () => {
  it("should read one test", async () => {
    const result = await mcpToolCall({
      tool: "tests.read_one",
      apiToken: "read",
      args: {
        testId: test._id
      }
    });

    expect(result).toEqual(
      expect.objectContaining({
        structuredContent: expect.objectContaining({
          data: expect.objectContaining({
            name: test.name,
            _id: test._id,
            _type: "test"
          })
        })
      })
    );
  });
});
