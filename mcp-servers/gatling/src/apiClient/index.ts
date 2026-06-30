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

export const apiClient: ApiClient = {
  locations: locations(),
  packages: packages(),
  teams: teams(),
  tests: tests(),
  runs: runs()
};
