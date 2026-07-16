import { mcpToolCall } from "@src/index.test.js";

import runs from "@src/__tests__/fixtures/runs.js";
import tests from "@src/__tests__/fixtures/tests.js";

const run = tests.dummy.runs.read;
const metadata = runs.metadata.static;

describe("runs.read_one", () => {
  it("should read one run", async () => {
    const result = await mcpToolCall({
      tool: "runs.read_one",
      apiToken: "read",
      args: {
        runId: run._id
      }
    });

    expect(result).toEqual(
      expect.objectContaining({
        structuredContent: expect.objectContaining({
          data: expect.objectContaining({
            _id: run._id,
            _type: "run",
            description: metadata.description,
            title: metadata.title
          })
        })
      })
    );
  });
});
