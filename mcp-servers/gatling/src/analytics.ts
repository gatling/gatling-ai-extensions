import * as os from "node:os";

import { HttpClient } from "@actions/http-client";
import { v4 as uuidv4, v5 as uuidv5 } from "uuid";

import { config, apiToken } from "./config.js";

const apiKeyDev = "c6150be222fed5925bee6210287aa12e";
const apiKeyProd = "68fa0276592045ff2bcd0d17425ca0ec";

export interface AnalyticsConfig {
  enableAnalytics: boolean;
  useDevEnvironment: boolean;
}

export interface Analytics {
  onServerReady(): void;
  onToolCall(toolname: string): void;
}

export const analyticsInit = (): Analytics => {
  if (!config.analytics.enableAnalytics) {
    return {
      onServerReady: () => {},
      onToolCall: () => {}
    };
  }

  const api_key = config.analytics.useDevEnvironment ? apiKeyDev : apiKeyProd;
  const { deviceId, apiTokenDefined } = resolveDeviceId();
  const user_properties = {
    system_os: os.type(),
    system_arch: os.arch(),
    mcp_server_version: config.version,
    api_token_defined: apiTokenDefined
  };

  const httpClient = new HttpClient();
  const sendEvent = (event_type: string, event_properties?: Record<string, any>): void => {
    const event = {
      device_id: deviceId,
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

/**
 * Fixed namespace used to derive stable analytics device ids.
 *
 * This is NOT a secret: it ships in the client and only provides domain
 * separation so our hashes never collide with the same source value hashed
 * elsewhere. The anonymity guarantee (a device_id can't be reversed back to an
 * API token or machine id) comes from SHA-1 preimage resistance plus the source
 * value's own entropy, not from this constant being secret.
 */
const analyticsNamespace = "bb693909-89f1-4f74-b0c5-353a8e21080d";

/**
 * Returns a stable, anonymous device id for analytics:
 *
 * 1. hash of the Gatling API token (stable everywhere the server can run, including Docker; irreversible so it stays anonymous)
 * 2. ephemeral random UUID (last resort; not stable across restarts)
 */
const resolveDeviceId = (): { deviceId: string; apiTokenDefined: boolean } => {
  if (apiToken && apiToken.length > 0) {
    const deviceId = uuidv5(apiToken, analyticsNamespace);
    return { deviceId, apiTokenDefined: true };
  }

  return { deviceId: uuidv4(), apiTokenDefined: false };
};
