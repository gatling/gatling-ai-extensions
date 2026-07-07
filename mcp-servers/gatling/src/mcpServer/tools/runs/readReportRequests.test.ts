import { mcpToolCall } from "@src/index.test.js";

describe("runs.read_report_requests", () => {
  it("should 404 when report has no metrics", async () => {
    const runId = "run_d6s4akhk47n3j8ehfjehompebe";
    const result = await mcpToolCall({
      tool: "runs.read_report_requests",
      apiToken: "read",
      args: {
        runId
      }
    });

    expect(result).toEqual({
      content: [
        {
          text: "GET /v2/runs/{runId}/views/report/requests returned status 404: Resource not found",
          type: "text"
        }
      ],
      isError: true
    });
  });
  it("should read report requests", async () => {
    const runId = "run_g3b47zg19fn19cjfk7kbax1hzc";
    const result = await mcpToolCall({
      tool: "runs.read_report_requests",
      apiToken: "read",
      args: {
        runId
      }
    });

    expect(result).toEqual(
      expect.objectContaining({
        structuredContent: expect.objectContaining({
          data: expect.any(Object),
          metadata: expect.any(Object)
        })
      })
    );
  });
});
