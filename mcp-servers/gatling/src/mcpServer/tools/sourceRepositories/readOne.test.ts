import { mcpToolCall } from "@src/index.test.js";

describe("source_repositories.read_one", () => {
  it("should read one test", async () => {
    const sourceRepositoryId = "source_repository_8y9hr9taji848jr8qecdpa9m6w";
    const result = await mcpToolCall({
      tool: "source_repositories.read_one",
      apiToken: "read",
      args: {
        sourceRepositoryId
      }
    });

    expect(result.structuredContent).toEqual({
      data: expect.objectContaining({
        name: "Gatling JS demo",
        _id: sourceRepositoryId,
        _type: "source_repository"
      })
    });
  });
});
