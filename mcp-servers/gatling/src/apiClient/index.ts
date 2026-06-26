import { HttpClient } from "@actions/http-client";

import { LocationEndpoints, locations } from "./locations.js";
import { PackageEndpoints, packages } from "./packages.js";
import { TeamEndpoints, teams } from "./teams.js";
import { TestEndpoints, tests } from "./tests.js";
import { RunsEndpoints, runs } from "./runs.js";

export interface ApiClient {
  locations: LocationEndpoints;
  packages: PackageEndpoints;
  teams: TeamEndpoints;
  tests: TestEndpoints;
  runs: RunsEndpoints;
}

const client = new HttpClient();
export const apiClient: ApiClient = {
  locations: locations(),
  packages: packages(client),
  teams: teams(client),
  tests: tests(),
  runs: runs()
};
