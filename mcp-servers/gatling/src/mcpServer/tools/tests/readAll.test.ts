import { mcpToolCall } from "@src/index.test.js";

import tests from "@src/__tests__/fixtures/tests.js";

describe("tests.read_all", () => {
  it("should list all tests", async () => {
    const result = await mcpToolCall({
      tool: "tests.read_all",
      apiToken: "read"
    });

    expect(result).toEqual(
      expect.objectContaining({
        structuredContent: expect.objectContaining({
          data: expect.arrayContaining([
            expect.objectContaining({
              name: tests.dummy.name
            })
          ])
        })
      })
    );
  });
});
