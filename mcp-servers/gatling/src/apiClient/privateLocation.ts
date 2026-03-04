import { HttpClient } from "@actions/http-client";

import { ApiClientConfig, getJson } from "./common.js";

export interface PrivateLocationApiClient {
  list(): Promise<ListPrivateLocationsResponse>;
}

export interface ListPrivateLocationsResponse {
  data: Array<{
    id: string;
    organizationSlug: string;
    type: string;
    description?: string;
  }>;
}

export const privateLocation = (
  client: HttpClient,
  conf: ApiClientConfig
): PrivateLocationApiClient => ({
  list: () => getJson(client, conf, "/api/public/search/private-locations", {}, {})
});
