import { mcpToolCall } from "@src/index.test.js";

describe("packages.read_all", () => {
  it("should list all packages", async () => {
    const result = await mcpToolCall({
      tool: "packages.read_all",
      apiToken: "read"
    });

    expect(result.structuredContent).toEqual({
      managedPackages: expect.arrayContaining([
        {
          name: "Gatling JS demo",
          _format: "js",
          _id: "package_xey3rapg5ifm7d7qor4qs4u1we",
          teamId: "team_iqay6s6s3tnj7kd41tthkfq3kh"
        }
      ]),
      privatePackages: []
    });
  });
});
