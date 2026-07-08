import { env } from "process";

import { AnalyticsConfig } from "./analytics.js";
import packageConfig from "../package.json" with { type: "json" };

export interface ApiConfig {
  baseUrl: string;
  apiToken(): string;
  pluginFlavor: string;
}

export interface Config {
  version: string;
  api: ApiConfig;
  analytics: AnalyticsConfig;
}

const apiTokenEnvVarKey = "GATLING_ENTERPRISE_API_TOKEN";
const apiUrlEnvVarKey = "GATLING_ENTERPRISE_API_URL";

const enableAnalyticsEnvVarKey = "GATLING_ENABLE_ANALYTICS";
const useDevEnvAnalyticsEnvVarKey = "GATLING_USE_DEV_ENV_ANALYTICS";

const getEnvBoolean = (name: string, defaultValue: boolean): boolean => {
  const envValue = env[name]?.trim()?.toLowerCase();
  if (envValue === undefined || envValue.length === 0) {
    return defaultValue;
  } else {
    return envValue !== "false" && envValue !== "0";
  }
};

const version = packageConfig.version;
const apiToken = env[apiTokenEnvVarKey]; // can be undefined at that point
const baseUrl = env[apiUrlEnvVarKey] ?? "https://api.gatling.io";
const enableAnalytics = getEnvBoolean(enableAnalyticsEnvVarKey, true);
const useDevEnvironment = getEnvBoolean(useDevEnvAnalyticsEnvVarKey, version.endsWith("-SNAPSHOT"));

export const config: Config = {
  version,
  api: {
    baseUrl,
    apiToken: () => {
      if (!apiToken) {
        throw Error(
          `A Gatling Enterprise API token must be configured using the ${apiTokenEnvVarKey} environment variable`
        );
      }
      return apiToken;
    },
    pluginFlavor: "mcp_server"
  },
  analytics: {
    enableAnalytics,
    useDevEnvironment
  }
};
