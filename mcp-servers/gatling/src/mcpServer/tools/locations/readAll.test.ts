import { mcpToolCall } from "@src/index.test.js";

import { managedLocations, privateLocations } from "@src/__tests__/fixtures/locations.js";

const stripEmojis = (name: string) =>
  name.replace(/[\p{Extended_Pictographic}\uFE0F]/gu, "").trim();

describe("locations.read_all", () => {
  it("should list all locations", async () => {
    const result = await mcpToolCall({
      tool: "locations.read_all",
      apiToken: "read"
    });

    expect(result).toEqual(
      expect.objectContaining({
        structuredContent: {
          managedLocations: expect.any(Array),
          privateLocations
        }
      })
    );
    expect(result.structuredContent?.["managedLocations"].map(stripEmojis)).toEqual(
      expect.arrayContaining(managedLocations)
    );
  });
});
