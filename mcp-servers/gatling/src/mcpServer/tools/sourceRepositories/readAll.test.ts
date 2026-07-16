import { mcpToolCall } from "@src/index.test.js";

import sourceRepositories from "@src/__tests__/fixtures/sourceRepositories.js";

describe("source_repositories.read_all", () => {
  it("should list all source repositories", async () => {
    const result = await mcpToolCall({
      tool: "source_repositories.read_all",
      apiToken: "read"
    });

    expect(result).toEqual(
      expect.objectContaining({
        structuredContent: expect.objectContaining({
          data: expect.arrayContaining([
            expect.objectContaining({
              name: sourceRepositories.js.name
            })
          ])
        })
      })
    );
  });
});
