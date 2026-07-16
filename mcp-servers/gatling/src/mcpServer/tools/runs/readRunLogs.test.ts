import { mcpToolCall } from "@src/index.test.js";

import tests from "@src/__tests__/fixtures/tests.js";

describe("runs.read_run_logs", () => {
  it("should read run logs", async () => {
    const result = await mcpToolCall({
      tool: "runs.read_run_logs",
      apiToken: "read",
      args: {
        runId: tests.dummy.runs.reports._id
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
