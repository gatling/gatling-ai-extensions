import { mcpToolCall } from "@src/index.test.js";

describe("locations.read_all", () => {
  it("should list all locations", async () => {
    const result = await mcpToolCall({
      tool: "locations.read_all",
      apiToken: "read"
    });

    expect(result.structuredContent).toEqual({
      managedLocations: [
        "Europe - Frankfurt",
        "AP Pacific - Mumbai",
        "US West - N. California",
        "AP - Hong kong",
        "AP - Tokyo",
        "Europe - Paris",
        "Europe - London",
        "Europe - Dublin",
        "SA East - São Paulo",
        "AP SouthEast - Sydney",
        "US East - N. Virginia",
        "US West - Oregon"
      ],
      privateLocations: [
        {
          id: "prl_rnd_x86_graal25",
          artifactFormats: ["js"],
          description: "GraalVM 25 (x86_64)"
        },
        {
          id: "prl_rnd_x86_zulu25",
          artifactFormats: ["jvm"],
          description: "Zulu 25 (x86_64)"
        }
      ]
    });
  });
});
