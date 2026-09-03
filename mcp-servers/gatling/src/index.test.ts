import { spawn } from "node:child_process";
import process from "node:process";

const debug = process.env.DEBUG !== undefined;

interface JsonRpcMessageFunction {
  (method: string, id: number | string, params?: Record<string, any>): string;
}

const jsonRpcMessage: JsonRpcMessageFunction = (method, id, params) => {
  const message = {
    jsonrpc: "2.0",
    method,
    id,
    params: {
      ...params,
      _meta: {
        "io.modelcontextprotocol/protocolVersion": "2026-07-28",
        "io.modelcontextprotocol/clientInfo": {
          name: "jest",
          title: "Jest",
          description: "",
          version: "0.0.0",
          websiteUrl: "https://github.com/gatling/gatling-ai-extensions"
        },
        "io.modelcontextprotocol/clientCapabilities": {}
      }
    }
  };

  return JSON.stringify(message);
};

const messages = {
  tools: {
    call: (name: string, args?: Record<string, any>) => {
      return jsonRpcMessage("tools/call", 0, {
        name,
        arguments: args ? args : {}
      });
    }
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

export const mcpToolCall: McpToolCallFunction = ({ tool, apiToken, args }) => {
  return new Promise((resolve, reject) => {
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

    const child = spawn("npm", ["--loglevel=warn", "run", "start"], {
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
        console.log("stderr.data", data.toString());
      }
      resolve(data);
    });

    child.stdout.on("data", (data: any) => {
      if (debug) {
        console.log("stdout.data", data.toString());
      }

      const json = JSON.parse(data.toString());
      if (debug) {
        console.log("tool called result", json.result);
      }
      resolve(json.result);

      child.stdin.end();
      child.kill();
    });

    send(messages.tools.call(tool, args));
  });
};
