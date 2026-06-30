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

export interface TestEndpoints {
  createOne(body: TestRequest): Promise<TestCreateOneResponse>;
  readAll(): Promise<TestReadAllResponse>;
  startOne(testId: string, title?: string, description?: string): Promise<TestStartOneResponse>;
}

export const tests = (): TestEndpoints => ({
  createOne: (body) => testCreateOne({ body }),
  readAll: () => testReadAll({}),
  startOne: (testId: string, title?: string, description?: string) =>
    testStartOne({
      body: { title, description },
      pathParams: { testId }
    })
});
