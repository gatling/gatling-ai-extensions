import { mcpToolCall } from "@src/index.test.js";

describe("runs.read_one", () => {
  it("should read one run", async () => {
    const runId = "run_apgaujoaot8k7f84we61s6dhxy";
    const result = await mcpToolCall({
      tool: "runs.read_one",
      apiToken: "read",
      args: {
        runId
      }
    });

    expect(result).toEqual(
      expect.objectContaining({
        structuredContent: expect.objectContaining({
          data: expect.objectContaining({
            title: "run title from jest",
            description: "run description from jest",
            _id: runId,
            _type: "run"
          })
        })
      })
    );
  });
});
