import { mcpToolCall } from "@src/index.test.js";

describe("tests.read_one", () => {
  it("should read one test", async () => {
    const testId = "test_85oi617ymtnz3ctq76thr9pyey";
    const result = await mcpToolCall({
      tool: "tests.read_one",
      apiToken: "read",
      args: {
        testId
      }
    });

    expect(result.structuredContent).toEqual({
      data: expect.objectContaining({
        name: "[R&D] dummy test",
        _id: testId,
        _type: "test"
      })
    });
  });
});
