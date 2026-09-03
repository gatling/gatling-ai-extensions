import { mcpToolCall } from "@src/index.test.js";

import { createOneArgs } from "@src/__tests__/fixtures/sourceRepositories.js";

let sourceRepositoryId: string;

describe("source_repositories.create_one", () => {
  it("should fail when called with an api token with insufficient permissions", async () => {
    const result = await mcpToolCall({
      tool: "source_repositories.create_one",
      apiToken: "start",
      args: createOneArgs
    });

    expect(result).toEqual(
      expect.objectContaining({
        content: [
          {
            text: "POST /v2/source-repositories returned status 403: the API token does not have sufficient privileges",
            type: "text"
          }
        ],
        isError: true
      })
    );
  });
  it("should fail when called with partial inputs", async () => {
    const { teamId: _, ...partialCreateOneArgs } = createOneArgs;
    const result = await mcpToolCall({
      tool: "source_repositories.create_one",
      apiToken: "configure",
      args: partialCreateOneArgs
    });

    expect(result).toEqual(
      expect.objectContaining({
        content: [
          {
            text: "Input validation error: Invalid arguments for tool source_repositories.create_one: teamId: Invalid input: expected string, received undefined",
            type: "text"
          }
        ],
        isError: true
      })
    );
  });
});

describe("source_repositories.create_one", () => {
  it("should succeed with proper inputs", async () => {
    const result = await mcpToolCall({
      tool: "source_repositories.create_one",
      apiToken: "configure",
      args: createOneArgs
    });

    expect(result).toEqual(
      expect.objectContaining({
        structuredContent: expect.objectContaining({
          data: {
            name: createOneArgs.name,
            _assets: {
              tests: []
            },
            _id: expect.stringMatching("source_repository_[a-z0-9]+"),
            _type: "source_repository",
            remote: {
              url: createOneArgs.remote.url
            },
            teamId: createOneArgs.teamId
          }
        })
      })
    );

    // @ts-ignore
    sourceRepositoryId = result.structuredContent.data._id;
    console.log("Created source repository with Id", sourceRepositoryId);
  });
  afterAll(async () => {
    const result = await mcpToolCall({
      tool: "source_repositories.delete_one",
      apiToken: "configure",
      args: {
        sourceRepositoryId
      }
    });

    expect(result).toEqual(
      expect.objectContaining({
        content: [
          {
            text: "Source repository successfully deleted",
            type: "text"
          }
        ]
      })
    );
  });
});
