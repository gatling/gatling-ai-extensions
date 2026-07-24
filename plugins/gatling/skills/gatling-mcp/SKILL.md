---
name: gatling-mcp
description: Guidance for using the Gatling MCP server's tools (tests, runs, packages, source repositories, locations, teams) to inspect and drive Gatling Enterprise. Use whenever calling those tools, before assuming an ID, role, or format that isn't spelled out in the tool's own description.
license: Apache-2.0
mcp-server: gatling
---

# Gatling MCP

The tool schemas define valid request shapes. Check each tool's own description directly rather than assuming from a sibling (e.g. read vs. write variants of the same resource aren't guaranteed to share a role floor, and a location's listing doesn't expose all of its capabilities).

Never call the Gatling Enterprise API directly (v1 or v2, via `curl`, a raw HTTP request, or any tool other than these MCP tools), even as a fallback when an MCP tool call fails. Always go through these MCP tools, and report failures to the user instead of working around them.

## Tools

There is no `packages.create_one` / `packages.delete_one`: packages can only be produced by actually building and uploading an artifact, never through this MCP.
If a build-tool skill/integration for packaging (e.g. one that drives the Enterprise Maven/Gradle/sbt/npm plugin's package goal) is available in the environment, prefer it over telling the user to do this by hand. This holds even if a hypothetical `packages.create_one` existed, since packaging is fundamentally a build step an API call can't substitute for.

## Terminology

- **Test**: a saved, runnable definition of *what* to run (`source`), *where* (`distribution.loadGenerators`), and under what conditions to stop (`execution.stopCriteria`). Running it produces a **run**.
- **Source**, on a test, is one of:
  - `build_from_sources`: `sourceRepositoryId` + `buildTool` (`maven`, `maven-wrapper`, `gradle`, `gradle-wrapper`, `sbt`, `npm`, or `custom` with an explicit `command`/`packageFormat`) + `simulation` (fully-qualified class/id), optional `branch`/`workingDirectory`. Built fresh from git on every run. Prefer one of the named build tools over `custom` whenever the project actually uses one of them. `custom` means hand-specifying the build command and output format, which is more error-prone and should be a fallback, not a default.
  - `packaged`: `packageId` + `simulation`. Runs a pre-built artifact as-is.
- **Source repository**: a registered git remote (`remote.url`) a test can build from. Metadata only (name/URL): auth (deploy key, PAT) isn't settable via `create_one`'s schema, so private repos likely still need credentials configured through Control Plane Builders.
- **Package**: a pre-built artifact (`_format`: `jvm` or `js`) uploaded outside the MCP.
- **Location**, in `distribution.loadGenerators[].locationId`: either a plain **managed location** name (a Gatling-hosted public region, e.g. `"Europe - Paris"`) or a **private location** `id` (starts with `prl_`). Same field, two different ID spaces. A private location's `artifactFormats` must include the format of what you're running (a `jvm`-only location can't run a `js` package/build).
- **Team**: the ownership/permission boundary. Every package, source repository, and test belongs to a team; roles are granted per team.
- **Roles**: granted per team, not globally. Having Configure on one team says nothing about another. At least Read, Configure, and Start appear across these tools as distinct levels; don't assume one implies another.
- **Credits**: consumed by `tests.start_one` (an actual run), not by any create/patch/delete/read call. Those only touch definitions or return data.

## Recommended workflows

Create a test for a project that already has a source repository or package registered:

1. `teams.read_all`, `source_repositories.read_all` and/or `packages.read_all` to find the real `teamId`/`sourceRepositoryId`/`packageId`. These are opaque IDs, never invent or reuse one from memory without reconfirming it still exists.
2. `locations.read_all` to pick a `locationId`, checking `artifactFormats` against the package/build format if using a private location, and, for `build_from_sources` on a private location, confirming separately that it's a Control Plane Builder (see Caveats).
3. `tests.create_one` with a `source` matching the actual project's language/build tool (see Caveats).
4. Confirm the resulting test looks right (`tests.read_one`) before calling `tests.start_one`, since starting spends credits and produces a visible run.

Onboard a project that isn't registered anywhere yet:

1. Check `source_repositories.read_all` / `packages.read_all` first. It may already be there under a name you don't expect.
2. If it's a git-buildable project, `source_repositories.create_one` (`name`, `teamId`, `remote.url`) registers it directly, no need to tell the user to do this by hand. For a private repo, flag that credentials may still need to be set up in the Control Plane Builder if the run later fails to clone.
3. If it's meant to run from a pre-built artifact instead, there's no equivalent create call. Use a build-tool skill/integration if one is available to build and upload it, otherwise that step has to happen outside the MCP (build plugin or UI); `packages.read_all` will pick it up once it exists.

Investigate a run: `runs.read_run_logs` for what happened during execution (build/injection/crash errors); `runs.read_report_requests` for the performance numbers, narrowed with `from`/`to` if only part of the run matters.

## Caveats

- Build tool / format must match the actual project. A Java/Maven project needs `buildTool.type: "maven"` (or `maven-wrapper`) against a repo that's actually that Maven project, or a `packaged` source whose `_format` is `jvm`. If the only registered source/package doesn't match the project you're actually being asked about, don't substitute it silently. A mismatch fails the build/run, it doesn't degrade gracefully. Say there's no matching source and ask how to proceed (register the real one via `source_repositories.create_one`, or confirm the mismatch is intentional).
- `tests.create_one`'s `execution` object is fully required, even fields that are logically optional in spirit. `systemProperties`, `environmentVariables`, `stopCriteria` must be present (empty object/array is fine), unlike `tests.patch_one` where the same fields are optional.
- `locationId` is overloaded: a managed location is matched by name string, a private location by its `prl_...`-style id. Don't assume one format for both.
- A `build_from_sources` test needs a Control Plane Builder if it runs on a private location. Only a private location whose Control Plane is deployed in Builder mode can build from git. A plain (load-generator-only) Control Plane can only run pre-packaged artifacts. `locations.read_all` doesn't expose this: a private location's entry is just `{id, artifactFormats, description}`, with nothing indicating whether it can build. Don't assume a private location supports `build_from_sources` just because its `artifactFormats` matches. Confirm with the user or point them at [Build from Git on private locations](https://docs.gatling.io/reference/deploy/private-locations/build-from-git/) before wiring one up. Managed (public) locations aren't affected as packages are already built.

## Troubleshooting

### MCP tool call fails

If any MCP tool call fails, check authentication first:

1. Verify `GATLING_ENTERPRISE_API_TOKEN` is set in the environment.
2. If missing, warn the user, suggest using `direnv`, and offer to create a `.envrc` file.
3. Never print the actual token value in the terminal or logs.
4. The token needs at least the **Configure** role on Gatling Enterprise.
