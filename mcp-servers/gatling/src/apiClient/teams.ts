import { HttpClient } from "@actions/http-client";

import { ApiClientConfig, getJson } from "./common.js";

export interface TeamEndpoints {
  readAll(): Promise<TeamReadAllResponse>;
}

export interface TeamReadAllResponse {
  data: Array<TeamItemResponse>;
}

export interface TeamItemResponse {
  name: string;
  _type: "team";
  _id: string;
  _limits: TeamLimits;
  _creditsUsed: number;
}

export interface TeamLimits {
  credits?: Credits;
}

export interface Credits {
  quota: number;
}

export const teams = (client: HttpClient, conf: ApiClientConfig): TeamEndpoints => ({
  readAll: () => getJson(client, conf, "/api/public/v2/teams", {}, {})
});
