import {
  testCreateOne,
  testReadAll,
  testReadOne,
  testStartOne
} from "../apiClientGenerated/gatlingEnterpriseComponents.js";
import {
  TestCreateOneResponse,
  TestReadAllResponse,
  TestReadOneResponse,
  TestRequest,
  TestStartOneResponse
} from "../apiClientGenerated/gatlingEnterpriseSchemas.js";

export interface TestEndpoints {
  createOne(body: TestRequest): Promise<TestCreateOneResponse>;
  readAll(): Promise<TestReadAllResponse>;
  readOne(testId: string): Promise<TestReadOneResponse>;
  startOne(testId: string, title?: string, description?: string): Promise<TestStartOneResponse>;
}

export const tests = (): TestEndpoints => ({
  createOne: (body) => testCreateOne({ body }),
  readAll: () => testReadAll({}),
  readOne: (testId) =>
    testReadOne({
      pathParams: { testId }
    }),
  startOne: (testId: string, title?: string, description?: string) =>
    testStartOne({
      body: { title, description },
      pathParams: { testId }
    })
});
