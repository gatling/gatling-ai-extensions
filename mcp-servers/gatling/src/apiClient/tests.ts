import {
  testCreateOne,
  testDeleteOne,
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
  deleteOne(testId: string): Promise<undefined>;
  readAll(): Promise<TestReadAllResponse>;
  readOne(testId: string): Promise<TestReadOneResponse>;
  startOne(testId: string, title?: string, description?: string): Promise<TestStartOneResponse>;
}

export const tests = (): TestEndpoints => ({
  createOne: (body) => testCreateOne({ body }),
  deleteOne: (testId) =>
    testDeleteOne({
      pathParams: { testId }
    }),
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
