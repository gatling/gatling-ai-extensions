import { HttpClient } from "@actions/http-client";

import { ApiClientConfig, getJson } from "./common.js";

export interface LocationEndpoints {
  readAll(): Promise<LocationReadAllResponse>;
}

export interface LocationReadAllResponse {
  data: Array<LocationItemResponse>;
}

export type LocationItemResponse = PrivateLocationItemResponse | ManagedLocationItemResponse;

export interface PrivateLocationItemResponse extends CommonLocationItemResponse {
  _type: "private_location";
  _description?: string;
}

export interface ManagedLocationItemResponse extends CommonLocationItemResponse {
  _type: "managed_location";
  _name: string;
}

export interface CommonLocationItemResponse {
  _id: string;
  _capabilities: {
    artifactFormats: Array<"jvm" | "js">;
  };
}

export const isPrivateLocation = (
  location: LocationItemResponse
): location is PrivateLocationItemResponse => location._type === "private_location";

export const isManagedLocation = (
  location: LocationItemResponse
): location is ManagedLocationItemResponse => location._type === "managed_location";

export const locations = (client: HttpClient, conf: ApiClientConfig): LocationEndpoints => ({
  // Filter parameters for the readAll method are not implemented as we do not use them
  readAll: () => getJson(client, conf, "/api/public/v2/locations", {}, {})
});
