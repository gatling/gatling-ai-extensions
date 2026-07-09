import { mcpToolCall } from "@src/index.test.js";

describe("runs.patch_one", () => {
  it("should fail when called with an api token with insufficient permissions", async () => {
    const result = await mcpToolCall({
      tool: "runs.patch_one",
      apiToken: "read",
      args: {
        runId: "run_mj5dgse66jd1xd6thggogooknr"
      }
    });

    expect(result).toEqual({
      content: [
        {
          text: "PUT /v2/runs/{runId} returned status 403: the API token does not have sufficient privileges",
          type: "text"
        }
      ],
      isError: true
    });
  });
  it("should succeed when modifying only the title field", async () => {
    const hash = Math.floor(Math.random() * Math.pow(2, 32)).toString(16);
    const title = `run title from jest (${hash})`;
    const result = await mcpToolCall({
      tool: "runs.patch_one",
      apiToken: "start",
      args: {
        runId: "run_mj5dgse66jd1xd6thggogooknr",
        patch: {
          title
        }
      }
    });

    expect(result).toEqual(
      expect.objectContaining({
        structuredContent: expect.objectContaining({
          data: expect.objectContaining({
            _id: "run_mj5dgse66jd1xd6thggogooknr",
            _type: "run",
            title
          })
        })
      })
    );
  });
  it("should succeed when modifying only the description field", async () => {
    const hash = Math.floor(Math.random() * Math.pow(2, 32)).toString(16);
    const description = `run description from jest (${hash})`;
    const result = await mcpToolCall({
      tool: "runs.patch_one",
      apiToken: "start",
      args: {
        runId: "run_mj5dgse66jd1xd6thggogooknr",
        patch: {
          description
        }
      }
    });

    expect(result).toEqual(
      expect.objectContaining({
        structuredContent: expect.objectContaining({
          data: expect.objectContaining({
            _id: "run_mj5dgse66jd1xd6thggogooknr",
            _type: "run",
            description
          })
        })
      })
    );
  });
});
