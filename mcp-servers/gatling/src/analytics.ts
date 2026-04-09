import * as os from "node:os";

import { HttpClient } from "@actions/http-client";
import { v4 as uuidv4 } from "uuid";

import { Config } from "./config.js";

const apiKeyDev = "c6150be222fed5925bee6210287aa12e";
const apiKeyProd = "68fa0276592045ff2bcd0d17425ca0ec";

const device_id = uuidv4();

export interface AnalyticsConfig {
  enableAnalytics: boolean;
  useDevEnvironment: boolean;
}

export interface Analytics {
  onServerReady(): void;
  onToolCall(toolname: string): void;
}

export const analyticsInit = (conf: Config): Analytics => {
  if (!conf.analytics.enableAnalytics) {
    return {
      onServerReady: () => {},
      onToolCall: () => {}
    };
  }

  const api_key = conf.analytics.useDevEnvironment ? apiKeyDev : apiKeyProd;
  const user_properties = {
    system_os: os.type(),
    system_arch: os.arch(),
    mcp_server_version: conf.version
  };

  const httpClient = new HttpClient();
  const sendEvent = (event_type: string, event_properties?: Record<string, any>): void => {
    const event = {
      device_id,
      event_type,
      ip: "$remote",
      user_properties,
      ...(event_properties ? { event_properties } : {})
    };
    httpClient
      .postJson("https://api.eu.amplitude.com/2/httpapi", {
        api_key,
        events: [event]
      })
      .catch(() => {
        // Do nothing
      });
  };

  // Send server starting event
  sendEvent("mcp_server_starting");

  return {
    onServerReady: () => sendEvent("mcp_server_ready"),
    onToolCall: (toolname: string) => sendEvent("mcp_tool_call", { toolname })
  };
};
