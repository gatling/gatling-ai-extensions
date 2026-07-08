import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {readFileSync} from "node:fs";

export const registerTemplates = (server: McpServer) => {
  server.registerResource(
    "AGENTS.md template",
    "gatling://templates/agents.md",
    {
      mimeType: "text/markdown",
      description:
        "AGENTS.md template to drop at the root of the project providing guidance for agents using the Gatling MCP server's tools to inspect and drive Gatling Enterprise. Copy it into your own project as `AGENTS.md` (or fold it into an existing one, e.g. via an `@AGENTS.md` import). When using Claude, make sure to add a import inside the CLAUDE.md file."
    },
    async (uri) => {
      const text = readFileSync(
        "target/AGENTS.md", // FIXME cwd for npx commands?
        {encoding: "utf-8", flag: "r"}
      ).trimEnd();

      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "text/markdown",
            text
          }
        ]
      };
    }
  );
};
