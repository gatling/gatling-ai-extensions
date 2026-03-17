import { HttpClient } from "@actions/http-client";

import { ApiClientConfig, getJson } from "./common.js";

export interface TestEndpoints {
  readAll(): Promise<TeamReadAllResponse>;
}

export interface TeamReadAllResponse {
  data: Array<TestItemResponse>;
}

export interface TestItemResponse {
  name: string;
  _type: "test";
  _id: string;
  _teamId: string;
  _updatedAt: string;
  source: SourceItem;
}

export interface SourceItem {
  type: TestTypeResponse;
}

export enum TestTypeResponse {
  BuildFromSources = "build_from_sources",
  Packaged = "packaged",
  NoCode = "no_code"
}

export const tests = (client: HttpClient, conf: ApiClientConfig): TestEndpoints => ({
  readAll: () => getJson(client, conf, "/api/public/v2/tests", {}, {})
});
