import { mcpToolCall } from "@src/index.test.js";

describe("runs.read_run_logs", () => {
  it("should read run logs", async () => {
    const runId = "run_g3b47zg19fn19cjfk7kbax1hzc";
    const result = await mcpToolCall({
      tool: "runs.read_run_logs",
      apiToken: "read",
      args: {
        runId
      }
    });

    expect(result).toEqual(
      expect.objectContaining({
        structuredContent: expect.objectContaining({
          data: expect.arrayOf({
            emittedAt: expect.any(String),
            message: expect.any(String)
          })
        })
      })
    );
  });
});
