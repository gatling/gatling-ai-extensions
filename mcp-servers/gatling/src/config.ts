import { env } from "process";

import { AnalyticsConfig } from "./analytics.js";
import packageConfig from "../package.json" with { type: "json" };

export interface ApiConfig {
  baseUrl: string;
  apiToken?: string;
  pluginFlavor: string;
}

export interface Config {
  version: string;
  api: ApiConfig;
  analytics: AnalyticsConfig;
}

const getEnvBoolean = (name: string, defaultValue: boolean): boolean => {
  const envValue = env[name]?.trim()?.toLowerCase();
  if (envValue === undefined || envValue.length === 0) {
    return defaultValue;
  } else {
    return envValue !== "false" && envValue !== "0";
  }
};

const version = packageConfig.version;
const apiToken = env.GATLING_ENTERPRISE_API_TOKEN; // can be undefined at that point
const baseUrl = env.GATLING_ENTERPRISE_API_URL ?? "https://api.gatling.io";
const enableAnalytics = getEnvBoolean("GATLING_ENABLE_ANALYTICS", true);
const useDevEnvironment = getEnvBoolean(
  "GATLING_USE_DEV_ENV_ANALYTICS",
  version.endsWith("-SNAPSHOT")
);

export const config: Config = {
  version,
  api: {
    baseUrl,
    apiToken,
    pluginFlavor: "mcp_server"
  },
  analytics: {
    enableAnalytics,
    useDevEnvironment
  }
};
