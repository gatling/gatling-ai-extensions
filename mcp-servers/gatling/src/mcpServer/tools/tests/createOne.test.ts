import { mcpToolCall } from "@src/index.test.js";

describe("tests.create_one", () => {
  it("should fail when called with an api token with insufficient permissions", async () => {
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
        sourceRepositoryId: "source_repository_4a5koo6p8irz3nmug6o9yknwde",
        buildTool: {
          type: "maven"
        },
        workingDirectory: "simulations/dummy",
        simulation: "example.BasicSimulation",
        type: "build_from_sources"
      }
    };

    const result = await mcpToolCall({
      tool: "tests.create_one",
      apiToken: "start",
      args: testsCreateOneArgs
    });

    expect(result.content[0].text).toBe(
      "POST /v2/tests returned status 403: the API token does not have sufficient privileges"
    );
  });
});
