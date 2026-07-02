import { mcpToolCall } from "@src/index.test.js";

describe("source_repositories.read_all", () => {
  it("should list all source repositories", async () => {
    const result = await mcpToolCall({
      tool: "source_repositories.read_all",
      apiToken: "read"
    });

    expect(result.structuredContent).toEqual({
      data: expect.arrayContaining([
        expect.objectContaining({
          name: "Gatling JS demo"
        })
      ])
    });
  });
});
