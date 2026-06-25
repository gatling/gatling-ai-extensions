import { HttpClient } from "@actions/http-client";

import { locationReadAll } from "../apiClientGenerated/gatlingEnterpriseComponents.js";
import {
  LocationItemResponse,
  LocationReadAllResponse,
  ManagedLocationItemResponse,
  PrivateLocationItemResponse
} from "../apiClientGenerated/gatlingEnterpriseSchemas.js";
import { ApiClientConfig } from "./common.js";

export interface LocationEndpoints {
  readAll(): Promise<LocationReadAllResponse>;
}

export const isPrivateLocation = (
  location: LocationItemResponse
): location is PrivateLocationItemResponse => location._type === "private_location";

export const isManagedLocation = (
  location: LocationItemResponse
): location is ManagedLocationItemResponse => location._type === "managed_location";

export const locations = (client: HttpClient, conf: ApiClientConfig): LocationEndpoints => ({
  // Filter parameters for the readAll method are not implemented as we do not use them
  readAll: () =>
    locationReadAll({
      apiToken: conf.apiToken,
      baseUrl: conf.baseUrl
    })
});
