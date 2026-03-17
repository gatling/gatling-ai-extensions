import { HttpClient } from "@actions/http-client";

import { ApiClientConfig, getJson } from "./common.js";

export interface LocationV1Endpoints {
  readPrivate(): Promise<PrivateLocationIndexV1ResponseList>;
}

export interface PrivateLocationIndexV1ResponseList {
  data: Array<PrivateLocationIndexV1Response>;
}

export interface PrivateLocationIndexV1Response {
  id: string;
  organizationSlug: string;
  type: string;
  description?: string;
}

export const locations = (client: HttpClient, conf: ApiClientConfig): LocationV1Endpoints => ({
  readPrivate: () => getJson(client, conf, "/api/public/search/private-locations", {}, {})
});
