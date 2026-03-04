import { HttpClient } from "@actions/http-client";

import { ApiClientConfig, getJson } from "./common.js";

export interface TeamApiClient {
  list(): Promise<ListTeamsResponse>;
}

export interface ListTeamsResponse {
  data: Array<{
    name: string;
    _type: string;
    _id: string;
    _limits: {
      credits?: {
        quota: number;
      };
    };
    _creditsUsed: number;
  }>;
}

export const team = (client: HttpClient, conf: ApiClientConfig): TeamApiClient => ({
  list: () => getJson(client, conf, "/api/public/v2/teams", {}, {})
});
