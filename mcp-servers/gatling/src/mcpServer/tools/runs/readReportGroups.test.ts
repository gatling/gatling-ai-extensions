import { mcpToolCall } from "@src/index.test.js";

describe("runs.read_report_groups", () => {
  it("should 404 when report has no groups", async () => {
    const runId = "run_g3b47zg19fn19cjfk7kbax1hzc";
    const result = await mcpToolCall({
      tool: "runs.read_report_groups",
      apiToken: "read",
      args: {
        runId
      }
    });

    expect(result).toEqual({
      content: [
        {
          text: "GET /v2/runs/{runId}/views/report/groups returned status 404: Resource not found",
          type: "text"
        }
      ],
      isError: true
    });
  });
  it("should read report groups", async () => {
    const runId = "run_jtpid9qgiff9786dprmhosa5uc";
    const result = await mcpToolCall({
      tool: "runs.read_report_groups",
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
