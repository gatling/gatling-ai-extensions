import { HttpClient } from "@actions/http-client";

import { ApiClientConfig, getJson } from "./common.js";

export interface PackageApiClient {
  list(): Promise<ListPackagesResponse>;
}

export interface ListPackagesResponse {
  data: PackageResponse[];
}

export interface PackageResponse {
  id: string;
  teamId: string;
  name: string;
  storageType: string;
  filename?: string;
  format?: string;
  size?: number;
}

export const pkg = (client: HttpClient, conf: ApiClientConfig): PackageApiClient => ({
  list: () => getJson(client, conf, "/api/public/artifacts", {}, {})
});
