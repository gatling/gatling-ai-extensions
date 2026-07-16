import { mcpToolCall } from "@src/index.test.js";

import sourceRepositories from "@src/__tests__/fixtures/sourceRepositories.js";

const sourceRepository = sourceRepositories.js;

describe("source_repositories.read_one", () => {
  it("should read one test", async () => {
    const result = await mcpToolCall({
      tool: "source_repositories.read_one",
      apiToken: "read",
      args: {
        sourceRepositoryId: sourceRepository._id
      }
    });

    expect(result).toEqual(
      expect.objectContaining({
        structuredContent: expect.objectContaining({
          data: expect.objectContaining({
            name: sourceRepository.name,
            _id: sourceRepository._id,
            _type: "source_repository"
          })
        })
      })
    );
  });
});
