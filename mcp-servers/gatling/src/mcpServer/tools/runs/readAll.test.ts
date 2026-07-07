import { mcpToolCall } from "@src/index.test.js";

describe("runs.read_all", () => {
  it("should list all runs", async () => {
    const result = await mcpToolCall({
      tool: "runs.read_all",
      apiToken: "read",
      args: {
        updatedAt: "2026-07-01T00:00:00.000Z"
      }
    });

    expect(result).toEqual(
      expect.objectContaining({
        structuredContent: expect.objectContaining({
          data: expect.arrayContaining([
            expect.objectContaining({
              title: "run title from jest"
            })
          ])
        })
      })
    );
  });
});
