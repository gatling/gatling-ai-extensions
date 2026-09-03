import { mcpToolCall } from "@src/index.test.js";

import tests from "@src/__tests__/fixtures/tests.js";

describe("runs.read_report_requests", () => {
  it("should 404 when report has no metrics", async () => {
    const result = await mcpToolCall({
      tool: "runs.read_report_requests",
      apiToken: "read",
      args: {
        runId: tests.creditless.runs.read._id
      }
    });

    expect(result).toEqual(
      expect.objectContaining({
        content: [
          {
            text: "GET /v2/runs/{runId}/views/report/requests returned status 404: Resource not found",
            type: "text"
          }
        ],
        isError: true
      })
    );
  });
  it("should read report requests", async () => {
    const result = await mcpToolCall({
      tool: "runs.read_report_requests",
      apiToken: "read",
      args: {
        runId: tests.dummy.runs.reports._id
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
