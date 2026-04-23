# Gatling AI Extensions

[<picture><source media="(prefers-color-scheme: dark)" srcset="https://docs.gatling.io/images/logo-gatling.svg"><img src="https://docs.gatling.io/images/logo-gatling-noir.svg" alt="Gatling" width="50%"></picture>](https://gatling.io)

AI-powered tools for load testing workflows, from writing scenarios to converting JMeter and LoadRunner scripts and running tests from your IDE.

Gatling AI Extensions is an MCP server and a collection of skills that bring load testing into your AI-assisted workflows. Write tests faster, edit configuration, convert existing JMeter or LoadRunner scripts automatically, and query your Gatling Enterprise infrastructure, all without leaving your development environment.

## Installation

### Claude Code

Installing the plugin gives you both the skills and the MCP server in one step.

First, configure the marketplace:

```bash
/plugin marketplace add gatling/gatling-ai-extensions
```

Then, install the plugin:

```bash
/plugin install gatling@gatling-ai-extensions
```

Or browse for the plugin via `/plugin > Discover`. Finally, reload Claude.

### Other MCP-compatible clients (Claude Desktop, Cursor, VS Code)

The skills are plain-text instruction files that any compatible AI assistant can pick up. The MCP server needs to be configured separately, see the [MCP server documentation](https://docs.gatling.io/ai/mcp-server/) for setup instructions.

## What's inside

### Skills

Skills are instruction files for AI coding assistants (Claude, Cursor, and compatible tools). They guide the AI agent to perform specific Gatling tasks accurately, preventing common LLM mistakes like wrong versions, hallucinating APIs, or incorrect protocol mappings.

| Skill | Description |
| --- | --- |
| [`gatling-bootstrap-project`](plugins/gatling/skills/gatling-bootstrap-project) | Scaffold a new Gatling project in your language and build tool of choice |
| [`gatling-build-tools`](plugins/gatling/skills/gatling-build-tools) | Build, compile, deploy, and run Gatling simulations from your IDE |
| [`gatling-configuration-as-code`](plugins/gatling/skills/gatling-configuration-as-code) | Manage Gatling Enterprise configuration as code |
| [`gatling-convert-from-jmeter`](plugins/gatling/skills/gatling-convert-from-jmeter) | Convert JMeter test plans (.jmx) to Gatling simulations |
| [`gatling-convert-from-loadrunner`](plugins/gatling/skills/gatling-convert-from-loadrunner) | Convert LoadRunner scripts to Gatling simulations |
| [`gatling-detect-existing-project`](plugins/gatling/skills/gatling-detect-existing-project) | Detect and work with an existing Gatling project in the current directory |

### MCP Server

| Server | Description |
| --- | --- |
| [`gatling`](mcp-servers/gatling) | MCP server for Gatling Enterprise to query teams, packages, simulations, and load generator locations from your IDE or any MCP-compatible client |

## Demo: LoadRunner to Gatling converter

> Convert your existing LoadRunner scripts to Gatling simulations in minutes without a manual rewrite.

[![LoadRunner to Gatling Converter Demo](https://cdn.prod.website-files.com/685a8fe4ddca049f26333871/69e0ad60bd79912cc12b9825_Loadrunner%20-%20Gatling%20Converter%20-%20Player.png)](https://docs.gatling.io/ai/overview/#convert-a-loadrunner-script-to-gatling)

*Click on the image to learn how to get started with LoadRunner to Gatling AI Converter*

The `gatling-convert-from-loadrunner` skill reads your exported LoadRunner project, maps every script element and runtime configuration to its Gatling equivalent, and generates a working simulation in your language of choice.

See the [LoadRunner converter documentation](https://docs.gatling.io/ai/overview/#convert-a-loadrunner-script-to-gatling) for the full list of what gets converted, step-by-step usage, and known limitations.

## Demo: JMeter to Gatling converter

> Convert your existing JMeter test plans to Gatling simulations in minutes.

[![JMeter to Gatling Converter Demo](https://cdn.prod.website-files.com/685a8fe4ddca049f26333871/69ce606e92a80d39a1c76f39_JMeter%20-%20Gatling%20Converter%20-%20Player.png)](https://docs.gatling.io/ai/overview/#convert-a-jmeter-script-to-gatling)

*Click on the image to learn how to get started with JMeter to Gatling AI Converter*

The `gatling-convert-from-jmeter` skill scans your project for `.jmx` files, maps every JMeter element to its Gatling equivalent, and generates a working simulation in your language of choice.

See the [JMeter converter documentation](https://docs.gatling.io/ai/overview/#convert-a-jmeter-script-to-gatling) for the full list of what gets converted, step-by-step usage, and known limitations.

## Demo: MCP Server

> Query your Gatling Enterprise resources in natural language, without leaving your development environment.

[![MCP Server Demo](https://cdn.prod.website-files.com/685a8fe4ddca049f26333871/69ce608c0c82b691c82d020e_MCP%20Server%20Demo.png)](https://docs.gatling.io/ai/mcp-server/)

*Click on the image to learn how to get started with Gatling MCP Server*

The Gatling MCP server connects Gatling Enterprise to any MCP-compatible client: Claude Code, Claude Desktop, Cursor, VS Code, or your own tooling. Once connected, you can query your load testing infrastructure in natural language.

See the [MCP server documentation](https://docs.gatling.io/ai/mcp-server/) for the full list of available tools, setup instructions, and client-specific configuration.

## Getting started

### Using skills with Claude, Cursor or any compatible coding assistant

Skills work as plain-text instruction files. Your AI assistant picks them up automatically when your request matches the skill's intent, or you can invoke them explicitly.

```text
# Automatic: describe what you want
"Convert a JMeter script to Gatling"
"Bootstrap a new Gatling project in Java with Maven"
"Build my Gatling project and deploy it to Gatling Enterprise"
"Generate a package.conf for my simulation"
"Detect the Gatling project in this directory"

# Explicit: reference the skill directly
"Execute the gatling-convert-from-jmeter skill"
```

### Combining skills

Skills are composable. For example, combining `gatling-build-tools` with `gatling-convert-from-jmeter` tells the AI to compile the project after each modification, catching errors automatically before you have to run anything manually.

## Requirements

- An AI coding assistant that supports skills (Claude Code, Cursor, or compatible)
- A valid `GATLING_ENTERPRISE_API_TOKEN` with at least the **Configure** role
- For the MCP server: a [Gatling Enterprise](https://gatling.io/) account, an MCP-compatible client, and either Node.js v20+ (for npx) or Docker
- For the JMeter converter: an existing `.jmx` file and a target Gatling project (or let the skill bootstrap one)
- For the LoadRunner converter: LoadRunner script files (the standard three-file layout, a directory of `.c`/`.h` files, a single combined `.c` file, or a VUGen-exported zip) and a target Gatling project (or let the skill bootstrap one)
- Supported simulation languages: Java, Kotlin, Scala, TypeScript, and JavaScript

## Contributing & Community

These skills and the MCP server improve with real-world usage, and we need yours.

**Tried the JMeter or LoadRunner converter?**
Tell us what worked, what didn't, and what the output looked like.
[Open an issue here.](https://github.com/gatling/gatling-ai-extensions/issues)

**Have a script that didn't convert correctly?**
Share a minimal excerpt, even a small snippet that failed is valuable.
We'll use it to improve the skill and credit your contribution.

**Built something with the MCP server or extended a skill?**
Show us. If it's useful for the community, we'll feature it.

## Resources

- [Gatling AI extensions documentation](https://docs.gatling.io/ai/overview/)
- [MCP server documentation](https://docs.gatling.io/ai/mcp-server/)
- [Gatling documentation](https://docs.gatling.io)
- [Gatling Community Forum](https://community.gatling.io)
- [Gatling on GitHub](https://github.com/gatling/gatling)
- [Try Gatling Enterprise](https://gatling.io/sign-up)
- Found a bug? [Raise an issue](https://github.com/gatling/gatling-ai-extensions/issues)

## License

Apache License 2.0