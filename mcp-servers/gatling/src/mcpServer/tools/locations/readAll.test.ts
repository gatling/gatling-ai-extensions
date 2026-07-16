import { mcpToolCall } from "@src/index.test.js";

import { managedLocations, privateLocations } from "@src/__tests__/fixtures/locations.js";

describe("locations.read_all", () => {
  it("should list all locations", async () => {
    const result = await mcpToolCall({
      tool: "locations.read_all",
      apiToken: "read"
    });

    expect(result).toEqual(
      expect.objectContaining({
        structuredContent: {
          managedLocations,
          privateLocations
        }
      })
    );
  });
});
