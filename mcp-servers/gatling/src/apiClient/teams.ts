import { teamReadAll } from "../apiClientGenerated/gatlingEnterpriseComponents.js";
import { TeamItemResponse } from "../apiClientGenerated/gatlingEnterpriseSchemas.js";

export interface TeamEndpoints {
  readAll(): Promise<TeamReadAllResponse>;
}

export interface TeamReadAllResponse {
  data: Array<TeamItemResponse>;
}

export const teams = (): TeamEndpoints => ({
  readAll: () => teamReadAll()
});
