import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { Commands } from "./Commands.js";
import { Instructions } from "./Instructions.js";
import { Run } from "./Run.js";
import { Scripts } from "./Scripts.js";

const WORKFLOW_RUN_DESCRIPTION = `Run a project workflow command (ci, lint:*, fix:*). Use this tool instead of the terminal; do not run bun run or npm run in the terminal.`;
const root = Scripts.rootDir();
const names = Commands.commands().map(c => c.name);
const scriptEnum = z.enum(names as [string, ...string[]]);

const server = new McpServer(
  { name: `do`, version: `0.0.0` },
  { capabilities: { resources: {}, tools: {} }, instructions: Instructions.instructions() },
);

server.registerTool(
  `workflow_run`,
  { description: WORKFLOW_RUN_DESCRIPTION, inputSchema: z.object({ script: scriptEnum }) },
  async ({ script }) => {
    const cmd = Commands.commandByName(script);
    if (cmd === undefined) {
      return { content: [{ text: `Unknown command: ${script}`, type: `text` as const }] };
    }
    const result = await Run.run(root, cmd.command, { stdio: `pipe` });
    const text = Run.formatResult(script, result);

    return { content: [{ text, type: `text` as const }] };
  },
);

const instructionsUri = `do://instructions`;
server.registerResource(
  `instructions`,
  instructionsUri,
  { description: `Start here: how to use the do server and when to use workflow_run instead of the terminal.` },
  () => ({ contents: [{ text: Instructions.instructions(), uri: instructionsUri }] }),
);

const transport = new StdioServerTransport();
await server.connect(transport);
console.error(`Do MCP server running on stdio`);
