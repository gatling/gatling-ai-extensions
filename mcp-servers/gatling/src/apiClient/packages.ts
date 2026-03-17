import { HttpClient } from "@actions/http-client";

import { ApiClientConfig, getJson } from "./common.js";

export interface PackageEndpoints {
  readAll(): Promise<PackageReadAllResponse>;
}

export interface PackageReadAllResponse {
  data: Array<PackageItemResponse>;
}

export interface PackageItemResponse {
  name: string;
  teamId: string;
  _type: "package";
  _id: string;
  _storage: PackageStorageItem;
}

export type PackageStorageItem = PackageStorageItemManaged | PackageStorageItemPrivate;

export interface PackageStorageItemManaged {
  type: "managed";
  artifact?: PackageArtifactItem;
}

export interface PackageStorageItemPrivate {
  type: "private";
  artifact?: PackageArtifactItem;
}

export interface PackageArtifactItem {
  format: string;
  gatlingCoreVersion: string;
}

export const packages = (client: HttpClient, conf: ApiClientConfig): PackageEndpoints => ({
  readAll: () => getJson(client, conf, "/api/public/v2/packages", {}, {})
});
