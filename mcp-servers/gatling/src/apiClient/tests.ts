import {
  testCreateOne,
  testStartOne,
  testReadAll
} from "../apiClientGenerated/gatlingEnterpriseComponents.js";
import {
  TestStartOneResponse,
  TestReadAllResponse,
  TestCreateOneResponse,
  TestRequest
} from "../apiClientGenerated/gatlingEnterpriseSchemas.js";
import { ApiClientConfig } from "./common.js";

export interface TestEndpoints {
  createOne(body: TestRequest): Promise<TestCreateOneResponse>;
  readAll(): Promise<TestReadAllResponse>;
  startOne(testId: string): Promise<TestStartOneResponse>;
}

export const tests = (conf: ApiClientConfig): TestEndpoints => ({
  createOne: (body) =>
    testCreateOne({
      apiToken: conf.apiToken,
      baseUrl: conf.baseUrl,
      body
    }),
  readAll: () =>
    testReadAll({
      apiToken: conf.apiToken,
      baseUrl: conf.baseUrl
    }),
  startOne: (testId: string) =>
    testStartOne({
      apiToken: conf.apiToken,
      baseUrl: conf.baseUrl,
      body: {},
      pathParams: { testId }
    })
});
