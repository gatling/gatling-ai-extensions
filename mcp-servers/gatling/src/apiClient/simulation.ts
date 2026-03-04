import { HttpClient } from "@actions/http-client";

import { ApiClientConfig, getJson } from "./common.js";

export interface SimulationApiClient {
  list(): Promise<ListSimulationsResponse>;
}

export type ListSimulationsResponse = Array<SimulationResponse>;

export type SimulationResponse = BuildSimulationResponse | PkgSimulationResponse;

export interface BuildSimulationResponse extends SimulationResponseBase {
  sourceRepositoryId: string;
  build: "gradle" | "gradle-wrapper" | "js-cli" | "maven" | "maven-wrapper" | "sbt" | "custom";
  workingDirectory?: String;
  branch?: String;
}

export interface PkgSimulationResponse extends SimulationResponseBase {
  build: {
    pkgId: string;
  };
}

export interface SimulationResponseBase {
  simulationType: string;
  id: string;
  idV2: string;
  teamId: string;
  name: string;
  className: string;
  // etc.
}

export const simulation = (client: HttpClient, conf: ApiClientConfig): SimulationApiClient => ({
  list: () => getJson(client, conf, "/api/public/simulations", {}, {})
});
