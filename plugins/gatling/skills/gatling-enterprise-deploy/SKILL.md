---
name: gatling-enterprise-deploy
description: Guide for deploying Gatling tests to Gatling Enterprise. Use this skill when the user wants to deploy or push tests on Gatling Enterprise using Gatling plugins and Configuration as Code.
license: Apache-2.0
---

# Gatling Enterprise - Deploy

## Instructions

### Step 1: Detect the build tool

Inspect the project root and identify the build tool by looking for these files, in this order:

- Maven: `pom.xml`
- JavaScript CLI: `package.json`
- Gradle: `build.gradle`, or `build.gradle.kts`
- sbt: `build.sbt`

### Step 2: Load build-tool-specific instructions

Once the build tool is identified, read the corresponding file and follow its instructions:

- Maven: ./build-tools/maven-plugin.md
- JavaScript CLI: ./build-tools/javascript-cli.md
- Gradle: ./build-tools/gradle-plugin.md
- sbt: ./build-tools/sbt-plugin.md

### Step 3: Common pre-flight checks

These checks apply regardless of build tools:

1. Verify `.gatling/package.conf` exists and is not empty. If missing or empty, help the user create it using the Configuration as Code skill.
2. Verify API token: check if `GATLING_ENTERPRISE_API_TOKEN` is set. If not, warn the user, suggest using `direnv`, and create a `.envrc` file.
   Always make sure to NOT print the actual token in the terminal logs.
3. Verify tests referenced matches actual test classes in the source tree.

### Step 4: Build-tool-specific steps

Follow the instructions from the file loaded in Step 2 for:
- Verifying the project compiles
- Running the deploy command

### Step 5: Post-deploy

The output logs package and test IDs.
Suggest updating `.gatling/package.conf` with these IDs for consistent future deployments.
