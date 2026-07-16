import { mcpToolCall } from "@src/index.test.js";

import packages from "@src/__tests__/fixtures/packages.js";

describe("packages.read_all", () => {
  it("should list all packages", async () => {
    const result = await mcpToolCall({
      tool: "packages.read_all",
      apiToken: "read"
    });

    expect(result).toEqual(
      expect.objectContaining({
        structuredContent: {
          managedPackages: expect.arrayContaining([
            {
              ...packages.js
            }
          ]),
          privatePackages: []
        }
      })
    );
  });
});
