import { mcpToolCall } from "@src/index.test.js";

import { createOneArgs, patchOneName } from "@src/__tests__/fixtures/tests.js";

let testId: string;

describe("tests.patch_one", () => {
  it("should fail when called with an api token with insufficient permissions", async () => {
    const result = await mcpToolCall({
      tool: "tests.create_one",
      apiToken: "start",
      args: createOneArgs
    });

    expect(result).toEqual({
      content: [
        {
          text: "POST /v2/tests returned status 403: the API token does not have sufficient privileges",
          type: "text"
        }
      ],
      isError: true
    });
  });
});

describe("tests.patch_one", () => {
  beforeAll(async () => {
    const result = await mcpToolCall({
      tool: "tests.create_one",
      apiToken: "configure",
      args: createOneArgs
    });

    expect(result).toEqual(
      expect.objectContaining({
        structuredContent: expect.objectContaining({
          data: expect.objectContaining({
            name: createOneArgs.name,
            _id: expect.stringMatching("test_[a-z0-9]+"),
            _type: "test"
          })
        })
      })
    );

    // @ts-ignore
    testId = result.structuredContent.data._id;
    console.log("Created test with Id", testId);
  });
  it("should succeed when modifying only the name field", async () => {
    const result = await mcpToolCall({
      tool: "tests.patch_one",
      apiToken: "configure",
      args: {
        testId,
        patch: {
          name: patchOneName
        }
      }
    });

    expect(result).toEqual(
      expect.objectContaining({
        structuredContent: expect.objectContaining({
          data: expect.objectContaining({
            name: patchOneName,
            _id: testId,
            _type: "test"
          })
        })
      })
    );
  });
  it("should fail when modifying distribution with wrong inputs", async () => {
    const result = await mcpToolCall({
      tool: "tests.patch_one",
      apiToken: "configure",
      args: {
        testId,
        patch: {
          distribution: {
            loadGenerators: [
              {
                locationId: "prl_rnd_x86_zulu25",
                instance: {
                  count: 2
                },
                loadPercentage: 90
              }
            ]
          }
        }
      }
    });

    expect(result).toEqual({
      content: [
        {
          text: expect.stringMatching(
            `PUT /v2/tests/\\{testId\\} returned status 422: Could not update test 'test_[a-z0-9]+'\n- Locations sum weight must be 100 \\(sum: 90\\)`
          ),
          type: "text"
        }
      ],
      isError: true
    });
  });
  it("should succeed when partially modifying a test with proper execution inputs", async () => {
    const result = await mcpToolCall({
      tool: "tests.patch_one",
      apiToken: "configure",
      args: {
        testId,
        patch: {
          execution: {
            meaningfulTimeWindow: {
              rampUpSeconds: 10
            }
          }
        }
      }
    });

    expect(result).toEqual(
      expect.objectContaining({
        structuredContent: expect.objectContaining({
          data: expect.objectContaining({
            name: patchOneName,
            _id: testId,
            _type: "test",
            execution: expect.objectContaining({
              meaningfulTimeWindow: {
                rampUpSeconds: 10,
                rampDownSeconds: 0
              }
            })
          })
        })
      })
    );
  });
  it("should succeed when partially modifying a test with proper source inputs", async () => {
    const result = await mcpToolCall({
      tool: "tests.patch_one",
      apiToken: "configure",
      args: {
        testId,
        patch: {
          source: {
            workingDirectory: null
          }
        }
      }
    });

    const { workingDirectory: _, ...createOneArgsSourceWithoutWorkingDirectory } =
      createOneArgs.source;

    expect(result).toEqual(
      expect.objectContaining({
        structuredContent: expect.objectContaining({
          data: expect.objectContaining({
            name: patchOneName,
            _id: testId,
            _type: "test",
            source: createOneArgsSourceWithoutWorkingDirectory
          })
        })
      })
    );
  });
  afterAll(async () => {
    const result = await mcpToolCall({
      tool: "tests.delete_one",
      apiToken: "configure",
      args: {
        testId
      }
    });

    expect(result).toEqual({
      content: [
        {
          text: "Test successfully deleted",
          type: "text"
        }
      ]
    });
  });
});
