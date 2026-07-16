import { mcpToolCall } from "@src/index.test.js";

import runs from "@src/__tests__/fixtures/runs.js";
import tests from "@src/__tests__/fixtures/tests.js";

const metadata = runs.metadata.dynamic;
const run = tests.dummy.runs.patch;

describe("runs.patch_one", () => {
  it("should fail when called with an api token with insufficient permissions", async () => {
    const result = await mcpToolCall({
      tool: "runs.patch_one",
      apiToken: "read",
      args: {
        runId: run._id
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
    const title = metadata.title();
    const result = await mcpToolCall({
      tool: "runs.patch_one",
      apiToken: "start",
      args: {
        runId: run._id,
        patch: {
          title
        }
      }
    });

    expect(result).toEqual(
      expect.objectContaining({
        structuredContent: expect.objectContaining({
          data: expect.objectContaining({
            _id: run._id,
            _type: "run",
            title
          })
        })
      })
    );
  });
  it("should succeed when modifying only the description field", async () => {
    const description = metadata.description();
    const result = await mcpToolCall({
      tool: "runs.patch_one",
      apiToken: "start",
      args: {
        runId: run._id,
        patch: {
          description
        }
      }
    });

    expect(result).toEqual(
      expect.objectContaining({
        structuredContent: expect.objectContaining({
          data: expect.objectContaining({
            _id: run._id,
            _type: "run",
            description
          })
        })
      })
    );
  });
});
