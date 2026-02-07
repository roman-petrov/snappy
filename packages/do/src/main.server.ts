/* eslint-disable no-console */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { Commands } from "./Commands";
import { Execute } from "./Execute";
import { Instructions } from "./Instructions";
import { Scripts } from "./Scripts";
import { Workflow } from "./Workflow";

const workflowRunDescription = `Run a project workflow command (run, dev, test, ci, lint:*, fix:*). Use this tool instead of the terminal; do not run bun run or npm run in the terminal.`;
const root = Scripts.rootDir();
const names = Commands.commands.map(c => c.name);
const scriptEnum = z.enum(names as [string, ...string[]]);
const inputSchema = z.object({ script: scriptEnum });

type WorkflowRunInput = z.infer<typeof inputSchema>;

const server = new McpServer(
  { name: `do`, version: `0.0.0` },
  { capabilities: { resources: {}, tools: {} }, instructions: Instructions.instructions },
);

server.registerTool(
  `workflow_run`,
  { description: workflowRunDescription, inputSchema },
  async ({ script }: WorkflowRunInput) => {
    const resolved = Workflow.resolve(script);
    if (!resolved.ok) {
      return { content: [{ text: resolved.error, type: `text` as const }] };
    }
    const result = await Execute.run(root, resolved.command, script, {
      stdio: script === `dev` ? `inherit` : `pipe`,
      timeoutMs: script === `dev` ? 600_000 : undefined,
    });

    return { content: [{ text: result.message, type: `text` as const }] };
  },
);

const instructionsUri = `do://instructions`;
server.registerResource(
  `instructions`,
  instructionsUri,
  { description: `Start here: how to use the do server and when to use workflow_run instead of the terminal.` },
  () => ({ contents: [{ text: Instructions.instructions, uri: instructionsUri }] }),
);

const transport = new StdioServerTransport();
await server.connect(transport);
console.error(`Do MCP server running on stdio`);
