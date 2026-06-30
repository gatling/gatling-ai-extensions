import { mcpToolCall } from "@src/index.test.js";

describe("MCP server", () => {
  it("should fail when no api token is set", async () => {
    const result = await mcpToolCall({
      tool: "tests.read_all",
      apiToken: "none"
    });

    expect(result).toEqual({
      content: [
        {
          text: "A Gatling Enterprise API token must be configured using the GATLING_ENTERPRISE_API_TOKEN environment variable",
          type: "text"
        }
      ],
      isError: true
    });
  });
  it("should fail when used with an invalid api token", async () => {
    const result = await mcpToolCall({
      tool: "tests.read_all",
      apiToken: "invalid"
    });

    expect(result).toEqual({
      content: [
        {
          text: "GET /v2/tests returned status 401: the API token is invalid",
          type: "text"
        }
      ],
      isError: true
    });
  });
});
