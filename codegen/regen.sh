#!/usr/bin/env bash

npm install
npx openapi-codegen gen gatlingEnterprise

sed -i '' -e 's/from ".\/gatlingEnterpriseFetcher"/from ".\/gatlingEnterpriseFetcher.js"/g' '../mcp-servers/gatling/src/apiClientGenerated/gatlingEnterpriseComponents.ts'
sed -i '' -e 's/from ".\/gatlingEnterpriseSchemas"/from ".\/gatlingEnterpriseSchemas.js"/g' '../mcp-servers/gatling/src/apiClientGenerated/gatlingEnterpriseComponents.ts'
