import { mcpToolCall } from "@src/index.test.js";

describe("runs.read_status", () => {
  it("should only return the status of a run", async () => {
    const runId = "run_abs1seqxxpb6dm11bxab7beipw";
    const result = await mcpToolCall({
      tool: "runs.read_status",
      apiToken: "read",
      args: {
        runId
      }
    });

    expect(result).toEqual({
      content: [
        {
          text: "assertions_successful",
          type: "text"
        }
      ]
    });
  });
});
