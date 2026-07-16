import { mcpToolCall } from "@src/index.test.js";

import tests from "@src/__tests__/fixtures/tests.js";

describe("runs.read_report_groups", () => {
  it("should 404 when report has no groups", async () => {
    const result = await mcpToolCall({
      tool: "runs.read_report_groups",
      apiToken: "read",
      args: {
        runId: tests.dummy.runs.reports._id
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
    const result = await mcpToolCall({
      tool: "runs.read_report_groups",
      apiToken: "read",
      args: {
        runId: tests.ecomm.runs.reports._id
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
