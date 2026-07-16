import { mcpToolCall } from "@src/index.test.js";

import tests from "@src/__tests__/fixtures/tests.js";

const run = tests.ecomm.runs.read;

describe("runs.read_status", () => {
  it("should only return the status of a run", async () => {
    const result = await mcpToolCall({
      tool: "runs.read_status",
      apiToken: "read",
      args: {
        runId: run._id
      }
    });

    expect(result).toEqual({
      content: [
        {
          text: run.status,
          type: "text"
        }
      ]
    });
  });
});
