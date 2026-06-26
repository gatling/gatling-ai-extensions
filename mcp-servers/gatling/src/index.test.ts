import { spawn } from "node:child_process";
import process from "node:process";

const debug = process.env.DEBUG !== undefined;

interface JsonRpcMessageFunction {
  (method: string, id?: number, params?: Record<string, any>): string;
}

const jsonRpcMessage: JsonRpcMessageFunction = (method, id, params) => {
  const message = {
    jsonrpc: "2.0",
    id: method == "tools/call" ? 2 : 1
  };

  return JSON.stringify(message);
};

const messages = {
  initialized:
    '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-11-25","capabilities":{"roots":{"listChanged":true},"sampling":{},"elicitation":{"form":{},"url":{}},"tasks":{"requests":{"elicitation":{"create":{}},"sampling":{"createMessage":{}}}}}}}',
  notificationsInitialized: '{"jsonrpc":"2.0","method":"notifications/initialized"}',
  toolsList: '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}',
  // TODO z schema?
  toolCall: (name: string, args?: Record<string, any>) => {
    return (
      '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"' +
      name +
      '","arguments":' +
      (args ? JSON.stringify(args) : "{}") +
      "}}"
    );
  }
};

const Start = 0;
const Initialized = 1;
const ToolsListed = 2;
const ToolCalled = 3;

interface McpToolCallArgs {
  tool: string;
  apiToken?: string | null; // null: use env, undefined: don't use any
  args?: Record<string, any>;
}

interface McpToolCallResult {
  content: Array<{ type: "text", text: string }>,
  structuredContent?: Record<string, any>
}

interface McpToolCallFunction {
  (args: McpToolCallArgs): Promise<McpToolCallResult>;
}

const mcpToolCall: McpToolCallFunction = ({ tool, apiToken, args }) => {
  return new Promise((resolve, reject) => {
    let state = -1;

    const effectiveApiToken =
      apiToken === null
        ? undefined
        : apiToken === undefined
          ? process.env.GATLING_ENTERPRISE_API_TOKEN
          : apiToken;

    const env: Record<string, string | undefined> = {
      ...process.env,
      GATLING_ENTERPRISE_API_TOKEN: effectiveApiToken
    };

    const child = spawn("npm", ["run", "start"], {
      env,
      detached: true
    });

    const send = (data: string) => {
      child.stdin.write(data);
      child.stdin.write("\n");
    };

    child.stderr.on("data", (data: any) => {
      resolve(data);
    });

    child.stdout.on("data", (data: any) => {
      if (state === Start) {
        send(messages.initialized);
      } else if (state === Initialized) {
        send(messages.notificationsInitialized);
        send(messages.toolsList);
      } else if (state === ToolsListed) {
        send(messages.toolCall(tool, args));
      } else if (state === ToolCalled) {
        const json = JSON.parse(data.toString());
        if (debug) {
          console.log("tool called result", json.result);
        }
        resolve(json.result);

        child.stdin.end();
        child.kill();
      }

      state++;
    });
  });
};

describe("API token tests", () => {
  test("Missing API token", async () => {
    const result = await mcpToolCall({
      apiToken: null,
      tool: "tests.read_all"
    });

    expect(result.content[0].text).toBe(
      "A Gatling Enterprise API token must be configured using the GATLING_ENTERPRISE_API_TOKEN environment variable"
    );
  });
  test("Missing API token", async () => {
    const result = await mcpToolCall({
      apiToken: "invalid api token",
      tool: "tests.read_all"
    });

    expect(result.content[0].text).toBe("GET /v2/tests returned status 401: the API token is invalid");
  });
  test("Good API token", async () => {
    const result = await mcpToolCall({
      tool: "tests.read_all"
    });

    expect(result.structuredContent).toBeDefined();
    // @ts-ignore
    expect(result.structuredContent.data).toBeDefined();
    // @ts-ignore
    expect(result.structuredContent.data[0].name).toBe("[R&D] build failure - simulation not found");
  });
  test("Good API token but not enough permissions", async () => {
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
      args: testsCreateOneArgs
    });

    expect(result.content[0].text).toBe(
      "POST /v2/tests returned status 403: the API token does not have sufficient privileges"
    );
  });
});
