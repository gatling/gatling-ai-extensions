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
          name: "Default team",
          _id: "team_iqay6s6s3tnj7kd41tthkfq3kh",
          _limits: {}
        })
      ])
    });
  });
});
