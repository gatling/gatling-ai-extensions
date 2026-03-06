import * as os from "node:os";

import * as amplitude from "@amplitude/analytics-node";
import { v4 as uuidv4 } from "uuid";

import { Config } from "./config.js";

const apiKeyDev = "c6150be222fed5925bee6210287aa12e";
const apiKeyProd = "68fa0276592045ff2bcd0d17425ca0ec";

const device_id = uuidv4();

export const analyticsInit = (conf: Config): void => {
  const apiKey = conf.version.endsWith("-SNAPSHOT") ? apiKeyDev : apiKeyProd;
  amplitude.init(apiKey, {
    serverZone: "EU"
    // logLevel: amplitude.Types.LogLevel.Debug
  });
  const identifyObj = new amplitude.Identify();
  identifyObj.set("system_os", os.type());
  identifyObj.set("system_arch", os.arch());
  identifyObj.set("mcp_server_version", conf.version);
  amplitude.identify(identifyObj, {
    device_id
  });
  amplitude.track("mcp_server_starting", undefined, { device_id });
};

export const analyticsOnServerReady = (): void => {
  amplitude.track("mcp_server_ready", undefined, { device_id });
};

export const analyticsOnToolCall = (toolname: string): void => {
  amplitude.track("mcp_tool_call", { toolname }, { device_id });
};
