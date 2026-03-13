# MCP server - TypeScript/Node.js with official MCP SDK - STDIO communication

## Setup

```shell
npm install
```

Other commands:

- Clean (delete compiled code): `npm run clean`
- Format code: `npm run format`
- Compile: `npm run build`
- Run the application: `npm run start`

Inspect the server with MCP Inspector: run the server with `npm run start` and launch the inspector with `npx @modelcontextprotocol/inspector`.

## Configure MCP server

Configurations bellow require exporting `GATLING_ENTERPRISE_API_TOKEN` before starting the LLM client.

In non-production environment, also export `GATLING_ENTERPRISE_API_URL`.

### With `npm` (from local project)

`mcpServers` configuration:

```json
{
  "type": "stdio",
  "command": "npm",
  "args": [
    "run",
    "--prefix",
    "<path-to-gatling-ai-extensions>/mcp-servers/gatling",
    "start"
  ],
  "env": {
    "GATLING_ENTERPRISE_API_TOKEN": "${GATLING_ENTERPRISE_API_TOKEN}"
  }
}
```

Install with Claude CLI:

```shell
claude mcp add "gatling-mcp-server" \
  --env 'GATLING_ENTERPRISE_API_TOKEN=${GATLING_ENTERPRISE_API_TOKEN}' \
  -- npm run --prefix <path-to-gatling-ai-extensions>/mcp-servers/gatling start
```

### With Docker

Build the Docker image:

```shell
npm run build
docker build --tag gatlingcorp/gatling-mcp-server:<tag> .  
```

`mcpServers` configuration:

```json
{
  "type": "stdio",
  "command": "docker",
  "args": [
    "run",
    "--rm",
    "-i",
    "-e",
    "GATLING_ENTERPRISE_API_TOKEN=${GATLING_ENTERPRISE_API_TOKEN}",
    "<local-image-tag>"
  ],
  "env": {
    "GATLING_ENTERPRISE_API_TOKEN": "${GATLING_ENTERPRISE_API_TOKEN}"
  }
}
```

Install with Claude CLI:

```shell
claude mcp add "gatling-mcp-server" \
  --env 'GATLING_ENTERPRISE_API_TOKEN=${GATLING_ENTERPRISE_API_TOKEN}' \
  -- docker run --rm --interactive --env GATLING_ENTERPRISE_API_TOKEN <local-image-tag>
```
