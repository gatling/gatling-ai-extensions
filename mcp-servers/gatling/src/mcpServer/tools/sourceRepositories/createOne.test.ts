import { mcpToolCall } from "@src/index.test.js";

let sourceRepositoryId: string;

const sourceRepositoriesCreateOneArgs = {
  name: "[R&D] sample source repository",
  teamId: "team_i5ofi3qru3d9jfapb1s68m3hao",
  remote: {
    url: "https://github.com/gatling/gatling-js-demo.git"
  }
};

describe("source_repositories.create_one", () => {
  it("should fail when called with an api token with insufficient permissions", async () => {
    const result = await mcpToolCall({
      tool: "source_repositories.create_one",
      apiToken: "start",
      args: sourceRepositoriesCreateOneArgs
    });

    expect(result).toEqual({
      content: [
        {
          text: "POST /v2/source-repositories returned status 403: the API token does not have sufficient privileges",
          type: "text"
        }
      ],
      isError: true
    });
  });
  it("should fail when called with partial inputs", async () => {
    const { teamId: _, ...partialSourceRepositoriesCreateOneArgs } =
      sourceRepositoriesCreateOneArgs;
    const result = await mcpToolCall({
      tool: "source_repositories.create_one",
      apiToken: "configure",
      args: partialSourceRepositoriesCreateOneArgs
    });

    expect(result).toEqual({
      content: [
        {
          text: 'MCP error -32602: Input validation error: Invalid arguments for tool source_repositories.create_one: [\n  {\n    "expected": "string",\n    "code": "invalid_type",\n    "path": [\n      "teamId"\n    ],\n    "message": "Invalid input: expected string, received undefined"\n  }\n]',
          type: "text"
        }
      ],
      isError: true
    });
  });
});

describe("source_repositories.create_one", () => {
  it("should succeed with proper inputs", async () => {
    const result = await mcpToolCall({
      tool: "source_repositories.create_one",
      apiToken: "configure",
      args: sourceRepositoriesCreateOneArgs
    });

    expect(result.structuredContent).toEqual({
      data: {
        name: "[R&D] sample source repository",
        _assets: {
          tests: []
        },
        _id: expect.stringMatching("source_repository_[a-z0-9]+"),
        _type: "source_repository",
        remote: {
          url: "https://github.com/gatling/gatling-js-demo.git"
        },
        teamId: "team_i5ofi3qru3d9jfapb1s68m3hao"
      }
    });

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

    expect(result).toEqual({
      content: [
        {
          text: "Source repository successfully deleted",
          type: "text"
        }
      ]
    });
  });
});
