# Gatling AI Extensions

[<picture><source media="(prefers-color-scheme: dark)" srcset="https://docs.gatling.io/images/logo-gatling.svg"><img src="https://docs.gatling.io/images/logo-gatling-noir.svg" alt="Gatling" width="50%"></picture>](https://gatling.io)

A Claude Code marketplace for Gatling AI plugins.

## Installation

The plugin can be installed directly from this marketplace via Claude Code's plugin system.

First, configure the marketplace:

```
/plugin marketplace add gatling/gatling-ai-extensions
```

Then, install the plugin:

```
/plugin install gatling@gatling-ai-extensions
```

Or browse for the plugin via `/plugin > Discover`.

Finally, reload Claude.

## Structure

- `./plugins/gatling`: Official Gatling plugin for Claude Code
- `./mcp-servers/gatling`: Official Gatling MCP server source code

## Requirements

A valid `GATLING_ENTERPRISE_API_TOKEN` with at least the **Configure** role.

## Documentation

For more information on Gatling AI extensions, see the [official documentation](https://docs.gatling.io/ai/extensions/overview/).

## Questions, help?

Read the [documentation](https://docs.gatling.io).

Join the [Gatling Community Forum](https://community.gatling.io).

Found a real bug? Raise an [issue](https://github.com/gatling/gatling/issues).
