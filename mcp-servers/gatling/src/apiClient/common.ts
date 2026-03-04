import { HttpClient, HttpClientError, HttpCodes } from "@actions/http-client";
import { TypedResponse } from "@actions/http-client/lib/interfaces";
import { OutgoingHttpHeaders } from "http";

export interface ApiClientConfig {
  baseUrl: string;
  apiToken?: string;
  pluginFlavor: string;
  pluginVersion: string;
}

export const getJson = <T>(
  client: HttpClient,
  conf: ApiClientConfig,
  path: string,
  params?: Record<string, string>,
  additionalHeaders?: OutgoingHttpHeaders
): Promise<T> =>
  client
    .getJson<T>(buildUrl(conf, path, params), { ...headers(conf), ...additionalHeaders })
    .then(handleJsonResponse);

const buildUrl = (
  conf: ApiClientConfig,
  path: string,
  queryParams?: Record<string, string>
): string => {
  const resourceUrl = conf.baseUrl + path;
  const url = new URL(resourceUrl);
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      url.searchParams.append(key, value);
    }
  }
  return url.toString();
};

const headers = (conf: ApiClientConfig): OutgoingHttpHeaders => ({
  "User-Agent": "GatlingMcpServer/v1",
  Accept: "application/json",
  "X-Gatling-Plugin-Flavor": conf.pluginFlavor,
  "X-Gatling-Plugin-Version": conf.pluginVersion,
  Authorization: conf.apiToken
});

const handleJsonResponse = <T>(response: TypedResponse<T>): T => {
  if (response.statusCode === HttpCodes.NotFound || response.result === null) {
    throw new HttpClientError("Unexpected empty response", HttpCodes.NotFound);
  }
  return response.result;
};
