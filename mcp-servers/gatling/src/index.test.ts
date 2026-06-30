import { spawn } from "node:child_process";
import process from "node:process";

const debug = process.env.DEBUG !== undefined;

interface JsonRpcMessageArgs {
  method: string;
  id?: number;
  params?: Record<string, any>;
}

interface JsonRpcMessageFunction {
  (args: JsonRpcMessageArgs): string;
}

const jsonRpcMessage: JsonRpcMessageFunction = (messageArgs) => {
  const message = {
    jsonrpc: "2.0",
    ...messageArgs
  };

  return JSON.stringify(message);
};

const messages = {
  initialize: jsonRpcMessage({
    method: "initialize",
    id: 0,
    params: {
      protocolVersion: "2025-11-25",
      capabilities: {},
      clientInfo: {
        "name": "jest",
        "version": "0.0.0"
      }
    }
  }),
  notificationsInitialized: jsonRpcMessage({ method: "notifications/initialized" }),
  toolsList: jsonRpcMessage({ method: "tools/list", id: 1, params: {} }),
  // TODO z schema?
  toolCall: (name: string, args?: Record<string, any>) => {
    return jsonRpcMessage({
      method: "tools/call",
      id: 2,
      params: {
        name,
        arguments: args ? args : {}
      }
    });
  }
};

export interface McpToolCallArgs {
  tool: string;
  apiToken: "none" | "invalid" | "read" | "start" | "configure" | "administrate";
  args?: Record<string, any>;
}

export interface McpToolCallResult {
  content: Array<{ type: "text"; text: string }>;
  structuredContent?: Record<string, any>;
}

export interface McpToolCallFunction {
  (args: McpToolCallArgs): Promise<McpToolCallResult>;
}

enum McpClientState {
  Uninitialized = -1,
  Start = 0,
  Initialized = 1,
  ToolsListed = 2,
  ToolCalled = 3
}

export const mcpToolCall: McpToolCallFunction = ({ tool, apiToken, args }) => {
  return new Promise((resolve, reject) => {
    let state = McpClientState.Uninitialized;

    const effectiveApiToken =
      apiToken === "none"
        ? undefined
        : apiToken === "invalid"
          ? "invalid api token"
          : process.env["GATLING_ENTERPRISE_API_TOKEN_" + apiToken.toUpperCase()];

    const env: Record<string, string | undefined> = {
      ...process.env,
      GATLING_ENTERPRISE_API_TOKEN: effectiveApiToken
    };

    const child = spawn("npm", ["run", "start"], {
      env,
      detached: true
    });

    child.on("error", (error) => {
      reject(error);
    });

    const send = (data: string) => {
      if (debug) {
        console.log("send", data);
      }

      child.stdin.write(data);
      child.stdin.write("\n");
    };

    child.stderr.on("data", (data: any) => {
      if (debug) {
        console.error("stderr.data", data.toString());
      }

      resolve(data);
    });

    child.stdout.on("data", (data: any) => {
      if (debug) {
        console.log("state", state);
        console.log("stdout.data", data.toString());
      }

      if (state === McpClientState.Start) {
        send(messages.initialize);
      } else if (state === McpClientState.Initialized) {
        send(messages.notificationsInitialized);
        send(messages.toolsList);
      } else if (state === McpClientState.ToolsListed) {
        send(messages.toolCall(tool, args));
      } else if (state === McpClientState.ToolCalled) {
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
