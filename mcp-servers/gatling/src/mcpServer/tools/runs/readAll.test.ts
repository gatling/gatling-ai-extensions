import { mcpToolCall } from "@src/index.test.js";

import runs from "@src/__tests__/fixtures/runs.js";
import tests from "@src/__tests__/fixtures/tests.js";

const metadata = runs.metadata.static;
const run = tests.dummy.runs.read;

describe("runs.read_all", () => {
  it("should list all runs", async () => {
    const result = await mcpToolCall({
      tool: "runs.read_all",
      apiToken: "read",
      args: {
        updatedAt: run.updatedAt
      }
    });

    expect(result).toEqual(
      expect.objectContaining({
        structuredContent: expect.objectContaining({
          data: expect.arrayContaining([
            expect.objectContaining({
              title: metadata.title
            })
          ])
        })
      })
    );
  });
});
