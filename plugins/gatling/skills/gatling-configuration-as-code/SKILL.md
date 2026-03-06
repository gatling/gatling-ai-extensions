---
name: gatling-configuration-as-code
description: Guide to generate or update the .gatling/package.conf package descriptor file for Gatling Enterprise deployment. Use this skill when the user wants to configure, set up, or modify their package descriptor file, stop criteria, or load generator settings using Configuration as Code.
license: Apache-2.0
mcp-server: gatling
---

# Gatling - Configuration as Code

This skill provides guidance on how to generate or update the `.gatling/package.conf` package descriptor file for deploying tests to Gatling Enterprise.

## Instructions

1. Discover simulations based on the project language and build tool used: Java with Maven, JavaScript/TypeScript with the JavaScript CLI, Kotlin with Gradle, and Scala with sbt. 
   Collect their fully qualified class names (FQCN).

2. Read existing config: check if `.gatling/package.conf` already exists. Also check `assets/package.conf` for reference.

3. Before asking any questions, call all the proper MCP tools to get real data from the user's account:

    - Which teams are available.
    - Which managed and private locations are available.
    - Check if a package already exists for this project.
    - Check if a test (aka simulation) already exists for this project.

4. Ask the user what they need with the `AskUserQuestion` tool.
   If a list has >4 items, output the full list as markdown in a text message and ask the user to specify their choice(s) by name.

    - Which tests to include.
    - Package name (default to the project name, use artifactId if this is a Maven project).
    - Team name or ID, asks the users if they want to create a new team.
    - Load generator locations and weights, ask if they want to use a managed or private location.
    - Any system properties or environment variables.
    - Ramp up and ramp down time windows.
    - Stop criteria.

5. Generate or update the file following the structure and rules below.

## Key Rules

- `simulation` (FQCN) is the only mandatory field per simulation entry.
- Location `weight` values must sum to 100 across all locations for a simulation.
- System property names must be quoted (HOCON interprets dots as nested keys).
- Prefix system properties with `sensitive.` to hide values from the dashboard.
- Prefix environment variables with `SENSITIVE_` to hide values from the dashboard.
- The `default` block avoids repeating shared config; simulation-specific values override it.
- Maps (`systemProperties`, `environmentVariables`) are merged, with simulation values taking priority.
- `ignoreDefaults` refers to Gatling Enterprise's Default Load Generator Parameters, not the `default {}` block.
- After first deploy, IDs are logged — add them to `id` fields for consistent updates (allows renaming without creating duplicates).

## Locations

For managed locations, use the full name.
For private locations, use their ID.

## Stop criteria

```hocon
stopCriteria = [
  {
    type = "meanCpu"
    timeFrameInSeconds = 10
    threshold = { maxPercentage = 90 }
  },
  {
    type = "globalResponseTime"
    timeFrameInSeconds = 10
    threshold = { maxMilliseconds = 500, percentile = 95 }
  },
  {
    type = "globalErrorRatio"
    timeFrameInSeconds = 10
    threshold = { maxPercentage = 5 }
  }
]
```

## Troubleshooting

### MCP tool call fails

If any MCP tool call fails, check authentication first:

1. Verify `GATLING_ENTERPRISE_API_TOKEN` is set in the environment.
2. If missing, warn the user, suggest using `direnv`, and offer to create a `.envrc` file.
3. Never print the actual token value in the terminal or logs.
4. The token needs at least the **Configure** role on Gatling Enterprise.
