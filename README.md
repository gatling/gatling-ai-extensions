# Gatling AI Extensions

[<picture><source media="(prefers-color-scheme: dark)" srcset="https://docs.gatling.io/images/logo-gatling.svg"><img src="https://docs.gatling.io/images/logo-gatling-noir.svg" alt="Gatling" width="50%"></picture>](https://gatling.io)

AI-powered tools for load testing workflows, from writing scenarios to converting JMeter and LoadRunner scripts and running tests from your IDE.

Gatling AI Extensions is an MCP server and a collection of skills that bring load testing into your AI-assisted workflows. Write tests faster, edit configuration, convert existing JMeter or LoadRunner scripts automatically, and query your Gatling Enterprise infrastructure — all without leaving your development environment.

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

The skills are plain-text instruction files that any compatible AI assistant can pick up. The MCP server needs to be configured separately, see the [MCP Server setup](#demo-mcp-server) section below.

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

[![LoadRunner to Gatling Converter Demo](https://cdn.prod.website-files.com/685a8fe4ddca049f26333871/69e0ad60bd79912cc12b9825_Loadrunner%20-%20Gatling%20Converter%20-%20Player.png)](https://app.arcade.software/share/m51KGGNMaycdbmNTQT6t)

*Click on the image to learn how to get started with LoadRunner to Gatling AI Converter*

The `gatling-convert-from-loadrunner` skill reads your exported LoadRunner project, maps every script element and runtime configuration to its Gatling equivalent, and generates a working simulation in your language of choice.

**What gets converted:**

- `vuser_init` / `Action` / `vuser_end` → `before` block, scenario, `after` block
- Runtime settings (`default.cfg`) → HTTP protocol config, pause strategy, error handling
- HTTP functions (`web_url`, `web_submit_data`, `web_custom_request`) → Gatling HTTP requests
- Response checks and correlations (`web_reg_find`, `web_reg_save_param`) → Gatling checks and session variables
- Parameter files (`.prm`, `.dat`) → Gatling feeders with matching selection strategy (random, sequential, circular)
- Single-request transactions → named HTTP requests (no redundant `group()` wrapper)
- Multi-request transactions → `group()` blocks
- Think times with distribution settings → `uniformPauses()` or `disablePauses()` on `setUp`
- Resource files (JSON bodies, CSV data) → copied to Gatling `resources` directory

**How to use it:**

1. Place your LoadRunner script in your project directory. The skill works with the standard three-file layout (`Action.c`, `vuser_init.c`, `vuser_end.c`), a directory of `.c`/`.h` files, a single combined `.c` file, or a VUGen-exported zip
2. Open it in VS Code, Cursor, or any Claude-compatible IDE
3. Prompt: `convert the LoadRunner script to Gatling`
4. The skill activates automatically, no slash command needed
5. Confirm the detected script and choose your language and build tool
6. Review the generated simulation and run it

> **Note:** Some LoadRunner features have no direct Gatling equivalent and need manual review — rendezvous points (`lr_rendezvous`), `SelectNextRow="Unique"` parameter selection, and `Options=MULTIPLY` think time. The skill flags these explicitly and suggests alternatives.

## Demo: JMeter to Gatling converter

> Convert your existing JMeter test plans to Gatling simulations in minutes.

[![JMeter to Gatling Converter Demo](https://cdn.prod.website-files.com/685a8fe4ddca049f26333871/69ce606e92a80d39a1c76f39_JMeter%20-%20Gatling%20Converter%20-%20Player.png)](https://app.arcade.software/share/XPlB8jfY8HEXNO59L3de)

*Click on the image to learn how to get started with JMeter to Gatling AI Converter*

The `gatling-convert-from-jmeter` skill scans your project for `.jmx` files, maps every JMeter element to its Gatling equivalent, and generates a working simulation in your language of choice.

**What gets converted:**

- Thread groups → Gatling scenarios
- CSV Data Set Config → feeders
- HTTP requests → Gatling HTTP protocol
- JMESPath extractors → Gatling JSON checks
- Disabled thread groups → commented scenarios
- Injection profiles → converted with improvement suggestions

**How to use it:**

1. Open your project in VS Code, Cursor, or any Claude-compatible IDE
2. Prompt: `convert the JMeter script to Gatling`
3. The skill activates automatically, no slash command needed
4. Confirm the detected `.jmx` file and choose your language and build tool
5. Review the generated simulation and run it

```bash
cd gatling-project/
./mvnw gatling:test
```

> **Note:** The converter gets you most of the way there. Some elements may need manual review, particularly injection profiles and complex Groovy scripts. This skill flags these explicitly and suggests improvements.

## Demo: MCP Server

> Query your Gatling Enterprise resources in natural language, without leaving your development environment.

[![MCP Server Demo](https://cdn.prod.website-files.com/685a8fe4ddca049f26333871/69ce608c0c82b691c82d020e_MCP%20Server%20Demo.png)](https://app.arcade.software/share/L0b4TuxIh06ZObAqJ37x)

*Click on the image to learn how to get started with Gatling MCP Server*

The Gatling MCP server connects Gatling Enterprise to any MCP-compatible client: Claude Code, Claude Desktop, Cursor, VS Code, or your own tooling. Once connected, you can query your load testing infrastructure in natural language.

**What you can do:**

- List teams and their credit usage
- List deployed packages (managed and private)
- List tests (simulations) configured in Gatling Enterprise
- List available load generator locations (managed and private)

**Setup:**

Claude Code users who installed the plugin already have the MCP server. For other clients, configure the server manually.

With `npx` (requires Node.js v20+):

```bash
claude mcp add gatling \
  --env 'GATLING_ENTERPRISE_API_TOKEN=${GATLING_ENTERPRISE_API_TOKEN}' \
  -- npx -y @gatling.io/gatling-mcp-server
```

With Docker:

```bash
claude mcp add gatling \
  --env 'GATLING_ENTERPRISE_API_TOKEN=${GATLING_ENTERPRISE_API_TOKEN}' \
  -- docker run --rm --interactive --env GATLING_ENTERPRISE_API_TOKEN gatlingcorp/gatling-mcp-server
```

For Claude Desktop, Cursor, or VS Code, see the [MCP server documentation](https://docs.gatling.io/ai/mcp-server/) for client-specific config.

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
Share a minimal excerpt — even a small snippet that failed is valuable.
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