import { mcpToolCall } from "@src/index.test.js";

describe("tests.read_all", () => {
  it("should list all tests", async () => {
    const result = await mcpToolCall({
      tool: "tests.read_all",
      apiToken: "read"
    });

    expect(result.structuredContent).toBeDefined();
    // @ts-ignore
    expect(result.structuredContent.data).toBeDefined();
    // @ts-ignore
    expect(result.structuredContent.data[0].name).toBe(
      "[R&D] build failure - simulation not found"
    );
  });
});
