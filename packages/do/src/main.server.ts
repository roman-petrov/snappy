/* eslint-disable functional/no-expression-statements */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Console } from "@snappy/node";
import { z } from "zod";

import { Commands } from "./Commands";
import { Instructions } from "./Instructions";
import { Runner } from "./Runner";
import { Scripts } from "./Scripts";

const root = Scripts.rootDir();
const inputSchema = z.object({ script: z.enum(Commands.list().map(c => c.name) as [string, ...string[]]) });

type WorkflowRunInput = z.infer<typeof inputSchema>;

const server = new McpServer(
  { name: `do`, version: `0.0.0` },
  { capabilities: { resources: {}, tools: {} }, instructions: Instructions.instructions },
);

server.registerTool(
  `workflow_run`,
  {
    description: `Run a project workflow command (run, dev, test, ci, lint:*, fix:*). Use this tool instead of the terminal; do not run npm run in the terminal.`,
    inputSchema,
  },
  async ({ script }: WorkflowRunInput) => {
    const resolved = Runner.resolveCommand(script);
    if (!resolved.ok) {
      return { content: [{ text: resolved.error, type: `text` as const }] };
    }
    const result = await Runner.run(root, resolved.name, { mcp: true });
    const text = Console.stripAnsi(result.message);

    return { content: [{ text, type: `text` as const }] };
  },
);

const instructionsUri = `do://instructions`;
server.registerResource(
  `instructions`,
  instructionsUri,
  { description: `Start here: how to use the do server and when to use workflow_run instead of the terminal.` },
  () => ({ contents: [{ text: Instructions.instructions, uri: instructionsUri }] }),
);

await server.connect(new StdioServerTransport());
Console.errorLine(`Do MCP server running on stdio`);
