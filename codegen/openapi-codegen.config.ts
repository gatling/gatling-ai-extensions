import {
  generateSchemaTypes,
  generateFetchers,
} from "@openapi-codegen/typescript";
import { defineConfig } from "@openapi-codegen/cli";

export default defineConfig({
  gatlingEnterprise: {
    from: {
      source: "url",
      url: "https://raw.githubusercontent.com/gatling/gatling-enterprise-api/refs/heads/main/openapi/src/main/openapi/openapi.json",
    },
    outputDir: "../mcp-servers/gatling/src/apiClientGenerated",
    to: async (context) => {
      const filenamePrefix = "gatlingEnterprise";
      const { schemasFiles } = await generateSchemaTypes(context, {
        filenamePrefix,
      });
      await generateFetchers(context, {
        filenamePrefix,
        schemasFiles,
      });
    }
  }
});
