---
name: gatling-enterprise-build-tools
description: Guide for deploying and starting Gatling tests on Gatling Enterprise. Use this skill when the user wants to deploy, push, or start tests on Gatling Enterprise using Gatling build tools (aka plugins) and Configuration as Code.
license: Apache-2.0
mcp-server: gatling
---

# Gatling Enterprise - Build Tools

## Instructions

### Step 1: Detect the build tool

Inspect the project root and identify the build tool by looking for these files, in this order:

- Maven: `pom.xml`
- JavaScript CLI: `package.json`
- Gradle: `build.gradle`, or `build.gradle.kts`
- sbt: `build.sbt`

### Step 2: Load build-tool-specific instructions

Once the build tool is identified, read the corresponding file and follow its instructions:

- Maven: ./references/maven-plugin.md
- JavaScript CLI: ./references/javascript-cli.md
- Gradle: ./references/gradle-plugin.md
- sbt: ./references/sbt-plugin.md

### Step 3: Common pre-flight checks

These checks apply regardless of build tools:

1. Verify `.gatling/package.conf` exists and is not empty.
   If missing or empty, help the user create it using the Configuration as Code skill.
2. Verify API token: check if `GATLING_ENTERPRISE_API_TOKEN` is set.
3. Verify tests referenced matches actual test classes in the source tree.

### Step 4: Build-tool-specific steps

Follow the instructions from the file loaded in Step 2 for:

1. Verifying the project compiles.
2. Running the deploy command.

### Step 5: Post-deploy

The output logs package and test IDs.
Suggest updating `.gatling/package.conf` with these IDs for consistent future deployments.

### Step 6: Starting a test

Ask the user if they want to start the test on Gatling Enterprise.
If so, follow the instructions from the file loaded in Step 2 for running the start command.

## Troubleshooting

### Build tool deploy/start or MCP tool call fails

If the build tool deploy/start or any MCP tool call fails, check authentication first:

1. Verify `GATLING_ENTERPRISE_API_TOKEN` is set in the environment.
2. If missing, warn the user, suggest using `direnv`, and offer to create a `.envrc` file.
3. Never print the actual token value in the terminal or logs.
4. The token needs at least the **Configure** role on Gatling Enterprise.
