import { HttpClient } from "@actions/http-client";

import { ApiClientConfig } from "./common.js";
import { PackageApiClient, pkg } from "./package.js";
import { privateLocation, PrivateLocationApiClient } from "./privateLocation.js";
import { SimulationApiClient, simulation } from "./simulation.js";
import { TeamApiClient, team } from "./team.js";

export interface ApiClient {
  team: TeamApiClient;
  pkg: PackageApiClient;
  simulation: SimulationApiClient;
  privateLocation: PrivateLocationApiClient;
}

export const apiClient = (conf: ApiClientConfig): ApiClient => {
  const client = new HttpClient();
  return {
    team: team(client, conf),
    pkg: pkg(client, conf),
    simulation: simulation(client, conf),
    privateLocation: privateLocation(client, conf)
  };
};
