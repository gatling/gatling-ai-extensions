import { mcpToolCall } from "@src/index.test.js";

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
              name: "[R&D] dummy test"
            })
          ])
        })
      })
    );
  });
});
