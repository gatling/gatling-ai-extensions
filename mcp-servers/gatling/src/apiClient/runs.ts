import { HttpClient } from "@actions/http-client";

import {
  runReadLogs,
  runViewReadReportRequests
} from "../apiClientGenerated/gatlingEnterpriseComponents.js";
import {
  RunReadLogsResponse,
  RunViewReadReportRequestsResponse
} from "../apiClientGenerated/gatlingEnterpriseSchemas.js";
import { ApiClientConfig } from "./common.js";

export interface RunsEndpoints {
  readRunLogs(runId: string): Promise<RunReadLogsResponse>;
  readReportRequests(runId: string): Promise<RunViewReadReportRequestsResponse>;
}

export const runs = (client: HttpClient, conf: ApiClientConfig): RunsEndpoints => ({
  readRunLogs: (runId) =>
    runReadLogs({
      apiToken: conf.apiToken,
      baseUrl: conf.baseUrl,
      pathParams: {
        runId
      }
    }),
  readReportRequests: (runId) =>
    runViewReadReportRequests({
      apiToken: conf.apiToken,
      baseUrl: conf.baseUrl,
      pathParams: {
        runId
      }
    })
});
