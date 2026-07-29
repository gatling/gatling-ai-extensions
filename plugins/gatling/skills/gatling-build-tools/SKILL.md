---
name: gatling-build-tools
description: Guide for using a Gatling project's build tool (Maven, Gradle, sbt, or the JavaScript CLI) to verify the project compiles, and to deploy/start tests on Gatling Enterprise using Configuration as Code. Use this skill whenever a Gatling project's compile/verify task needs to be run, or when the user wants to deploy, push, or start tests on Gatling Enterprise.
license: Apache-2.0
mcp-server: gatling
---

# Gatling Build Tools

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

### Step 3: Determine scope

IF only compile verification is needed (invoked to check a project builds, e.g. from another skill's compile step, or the user just wants to confirm the code compiles):
- Run the compile/verify task documented in the file loaded in Step 2. Done once that task's pass/fail result is known; do not continue into the deploy steps below.

IF deploying and/or starting a test on Gatling Enterprise:
- Continue to Step 4.

### Step 4: Pre-flight checks before deploying

These checks apply regardless of build tool:

1. Verify `.gatling/package.conf` exists and is not empty.
   If missing or empty, help the user create it using the Configuration as Code skill.
2. Verify API token: check if `GATLING_ENTERPRISE_API_TOKEN` is set.
3. Verify tests referenced matches actual test classes in the source tree.

### Step 5: Build-tool-specific steps

Follow the instructions from the file loaded in Step 2 for:

1. Verifying the project compiles.
2. Running the deploy command.

### Step 6: Post-deploy

The output logs package and test IDs.
Suggest updating `.gatling/package.conf` with these IDs for consistent future deployments.

### Step 7: Starting a test

Ask the user if they want to start the test on Gatling Enterprise.
If so, follow the instructions from the file loaded in Step 2 for running the start command.

## Troubleshooting

If the build tool deploy/start fails, see the /gatling:gatling-mcp skill's Troubleshooting section for authentication checks.
