import { mcpToolCall } from "@src/index.test.js";

import teams from "@src/__tests__/fixtures/teams.js";

const team = teams.ci;

describe("teams.read_all", () => {
  it("should list all teams", async () => {
    const result = await mcpToolCall({
      tool: "teams.read_all",
      apiToken: "read"
    });

    expect(result).toEqual(
      expect.objectContaining({
        structuredContent: expect.objectContaining({
          data: expect.arrayContaining([
            expect.objectContaining({
              name: team.name,
              _id: team._id,
              _limits: {}
            })
          ])
        })
      })
    );
  });
});
