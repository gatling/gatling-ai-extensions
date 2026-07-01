import { OutgoingHttpHeaders } from "node:http";

import { HttpClient } from "@actions/http-client";

import { config } from "../config.js";
import { ErrorContent } from "@src/apiClientGenerated/gatlingEnterpriseSchemas.js";

export type GatlingEnterpriseFetcherExtraProps = {
  /**
   * You can add some extra props to your generated fetchers.
   *
   * Note: You need to re-gen after adding the first property to
   * have the `GatlingEnterpriseFetcherExtraProps` injected in `GatlingEnterpriseComponents.ts`
   **/
};

export type ErrorWrapper<TError> = TError | { status: "unknown"; payload: string };

export type GatlingEnterpriseFetcherOptions<TBody, THeaders, TQueryParams, TPathParams> = {
  url: string;
  method: string;
  body?: TBody;
  headers?: THeaders;
  queryParams?: TQueryParams;
  pathParams?: TPathParams;
  signal?: AbortSignal;
};

const client = new HttpClient();

export const gatlingEnterpriseFetch = async <
  TData extends {} | undefined,
  TError,
  TBody extends {} | undefined | null,
  THeaders extends {},
  TQueryParams extends {},
  TPathParams extends {}
>({
  url,
  method,
  body,
  headers,
  pathParams,
  queryParams,
  signal
}: GatlingEnterpriseFetcherOptions<TBody, THeaders, TQueryParams, TPathParams>): Promise<TData> => {
  const requestHeaders: OutgoingHttpHeaders = {
    "User-Agent": "GatlingMcpServer/v1",
    Accept: "application/json",
    "X-Gatling-Plugin-Flavor": config.api.pluginFlavor,
    "X-Gatling-Plugin-Version": config.version,
    Authorization: config.api.apiToken(),
    ...headers
  };

  const response = await client.request(
    method.toUpperCase(),
    `${config.api.baseUrl}/api/public${resolveUrl(url, queryParams, pathParams)}`,
    body ? JSON.stringify(body) : null,
    requestHeaders
  );
  const status = response.message.statusCode;
  if (status === undefined) {
    throw Error(
      "HTTP status was undefined (this should not happen and indicates a bug in the API client)"
    );
  }
  const responseBody = await response.readBody();

  if (status < 300) {
    if (status === 204) {
      return responseBody as unknown as TData;
    } else {
      if (responseBody.trim().length === 0) {
        throw new Error(`Gatling Enterprise API unexpected empty response with status ${status}`);
      }
      return JSON.parse(responseBody);
    }
  } else {
    let errorMessage;
    if (status === 401) {
      // Unauthorized
      errorMessage = "the API token is invalid";
    } else if (status === 403) {
      // Forbidden
      errorMessage = "the API token does not have sufficient privileges";
    } else {
      // {
      //   "code": "TEST_UPDATE_ERROR",
      //   "message": "Could not update test 'test_uiphfk8rcfgyzmj3mqa8dnxdco'",
      //   "reasons": [
      //      {
      //        "code": "TEST_INVALID_TOTAL_WEIGHTS_LOCATIONS",
      //        "message": "Locations sum weight must be 100 (sum: 90)",
      //        "values": {
      //          "expected": "100",
      //          "totalWeight": "90"
      //        }
      //      }
      //    ],
      //   "values": {
      //     "testId": "test_uiphfk8rcfgyzmj3mqa8dnxdco"
      //   }
      // }
      try {
        const payload = JSON.parse(responseBody);
        errorMessage = payload.message;

        const reasons: ErrorContent[] | undefined = payload.reasons;
        if (Array.isArray(reasons)) {
          for (let reason of payload.reasons) {
            errorMessage += `\n- ${reason.message}`;
          }
        }
      } catch (e) {
        errorMessage = responseBody;
      }
    }
    throw Error(`${method.toUpperCase()} ${url} returned status ${status}: ${errorMessage}`);
  }
};

const resolveUrl = (
  url: string,
  queryParams: Record<string, string> = {},
  pathParams: Record<string, string> = {}
) => {
  let query = new URLSearchParams(queryParams).toString();
  if (query) query = `?${query}`;
  return url.replace(/\{\w*\}/g, (key) => pathParams[key.slice(1, -1)] ?? "") + query;
};
