import { packageReadAll } from "../apiClientGenerated/gatlingEnterpriseComponents.js";
import { PackageReadAllResponse } from "../apiClientGenerated/gatlingEnterpriseSchemas.js";

export interface PackageEndpoints {
  readAll(): Promise<PackageReadAllResponse>;
}

export const packages = (): PackageEndpoints => ({
  readAll: () => packageReadAll()
});
