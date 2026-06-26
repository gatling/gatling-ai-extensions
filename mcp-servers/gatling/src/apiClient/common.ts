import { OutgoingHttpHeaders } from "node:http";

import { HttpClient, HttpClientError, HttpCodes } from "@actions/http-client";
import { TypedResponse } from "@actions/http-client/lib/interfaces";

import { config } from "../config.js";

export const getJson = <T>(
  client: HttpClient,
  path: string,
  params?: Record<string, string>,
  additionalHeaders?: OutgoingHttpHeaders
): Promise<T> =>
  client
    .getJson<T>(buildUrl(path, params), { ...headers(), ...additionalHeaders })
    .then(handleJsonResponse);

const buildUrl = (path: string, queryParams?: Record<string, string>): string => {
  const resourceUrl = config.api.baseUrl + path;
  const url = new URL(resourceUrl);
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      url.searchParams.append(key, value);
    }
  }
  return url.toString();
};

const headers = (): OutgoingHttpHeaders => ({
  "User-Agent": "GatlingMcpServer/v1",
  Accept: "application/json",
  "X-Gatling-Plugin-Flavor": config.api.pluginFlavor,
  "X-Gatling-Plugin-Version": config.version,
  Authorization: config.api.apiToken
});

const handleJsonResponse = <T>(response: TypedResponse<T>): T => {
  if (response.statusCode === HttpCodes.NotFound || response.result === null) {
    throw new HttpClientError("Unexpected empty response", HttpCodes.NotFound);
  }
  return response.result;
};
