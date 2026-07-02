import { mcpToolCall } from "@src/index.test.js";

let testId: string;

const testsCreateOneArgs = {
  name: "[R&D] sample test",
  distribution: {
    loadGenerators: [
      {
        locationId: "prl_rnd_x86_zulu25",
        instance: {
          count: 1
        }
      }
    ]
  },
  execution: {
    meaningfulTimeWindow: {
      rampUpSeconds: 0,
      rampDownSeconds: 0
    },
    systemProperties: {},
    environmentVariables: {},
    ignoreGlobalProperties: false,
    stopCriteria: []
  },
  source: {
    sourceRepositoryId: "source_repository_8y9hr9taji848jr8qecdpa9m6w",
    buildTool: {
      type: "maven"
    },
    workingDirectory: "simulations/dummy",
    simulation: "example.BasicSimulation",
    type: "build_from_sources"
  }
};

describe("tests.delete_one", () => {
  beforeAll(async () => {
    const result = await mcpToolCall({
      tool: "tests.create_one",
      apiToken: "configure",
      args: testsCreateOneArgs
    });

    expect(result).toEqual(
      expect.objectContaining({
        structuredContent: expect.objectContaining({
          data: expect.objectContaining({
            name: "[R&D] sample test",
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
  it("should fail when called with an api token with insufficient permissions", async () => {
    const result = await mcpToolCall({
      tool: "tests.delete_one",
      apiToken: "start",
      args: {
        testId
      }
    });

    expect(result).toEqual({
      content: [
        {
          text: "DELETE /v2/tests/{testId} returned status 403: the API token does not have sufficient privileges",
          type: "text"
        }
      ],
      isError: true
    });
  });
  it("should successfully delete one test", async () => {
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
