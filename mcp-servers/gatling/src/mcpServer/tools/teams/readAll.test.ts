import { mcpToolCall } from "@src/index.test.js";

describe("teams.read_all", () => {
  it("should list all teams", async () => {
    const result = await mcpToolCall({
      tool: "teams.read_all",
      apiToken: "read"
    });

    expect(result.structuredContent).toEqual({
      data: expect.arrayContaining([
        expect.objectContaining({
          name: "Jest",
          _id: "team_i5ofi3qru3d9jfapb1s68m3hao",
          _limits: {}
        })
      ])
    });
  });
});
