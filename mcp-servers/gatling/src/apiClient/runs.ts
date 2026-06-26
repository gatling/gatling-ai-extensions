import {
  runReadLogs,
  runViewReadReportRequests
} from "../apiClientGenerated/gatlingEnterpriseComponents.js";
import {
  RunReadLogsResponse,
  RunViewReadReportRequestsResponse
} from "../apiClientGenerated/gatlingEnterpriseSchemas.js";

export interface RunsEndpoints {
  readRunLogs(runId: string): Promise<RunReadLogsResponse>;
  readReportRequests(runId: string): Promise<RunViewReadReportRequestsResponse>;
}

export const runs = (): RunsEndpoints => ({
  readRunLogs: (runId) => runReadLogs({ pathParams: { runId } }),
  readReportRequests: (runId) => runViewReadReportRequests({ pathParams: { runId } })
});
