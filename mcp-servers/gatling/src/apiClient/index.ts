import { HttpClient } from "@actions/http-client";

import { ApiClientConfig } from "./common.js";
import { LocationV1Endpoints, locations } from "./locations.js";
import { PackageEndpoints, packages } from "./packages.js";
import { TeamEndpoints, teams } from "./teams.js";
import { TestEndpoints, tests } from "./tests.js";

export interface ApiClient {
  locations: LocationV1Endpoints;
  packages: PackageEndpoints;
  teams: TeamEndpoints;
  tests: TestEndpoints;
}

export const apiClient = (conf: ApiClientConfig): ApiClient => {
  const client = new HttpClient();
  return {
    locations: locations(client, conf),
    packages: packages(client, conf),
    teams: teams(client, conf),
    tests: tests(client, conf)
  };
};
