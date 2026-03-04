import { env } from "process";

import { ApiClientConfig } from "./apiClient/common.js";
import packageConfig from "../package.json" with { type: "json" };

export interface Config {
  version: string;
  apiClient: ApiClientConfig;
}

export const readConfig = (): Config => {
  const version = packageConfig.version;
  const apiToken = env.GATLING_ENTERPRISE_API_TOKEN; // can be undefined at that point
  const baseUrl = env.GATLING_ENTERPRISE_API_URL ?? "https://api.gatling.io";
  return {
    version,
    apiClient: {
      baseUrl,
      apiToken,
      pluginFlavor: "mcp_server",
      pluginVersion: version
    }
  };
};
