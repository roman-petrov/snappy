/* eslint-disable no-console */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { Commands } from "./Commands";
import { Instructions } from "./Instructions";
import { Run } from "./Run";
import { RunAll } from "./RunAll";
import { Scripts } from "./Scripts";
import { Workflow } from "./Workflow";

const workflowRunDescription = `Run a project workflow command (run, dev, test, ci, lint:*, fix:*). Use this tool instead of the terminal; do not run bun run or npm run in the terminal.`;
const root = Scripts.rootDir();
const names = Commands.commands().map(c => c.name);
const scriptEnum = z.enum(names as [string, ...string[]]);
const inputSchema = z.object({ script: scriptEnum });

type WorkflowRunInput = z.infer<typeof inputSchema>;

const server = new McpServer(
  { name: `do`, version: `0.0.0` },
  { capabilities: { resources: {}, tools: {} }, instructions: Instructions.instructions() },
);

server.registerTool(
  `workflow_run`,
  {
    description: workflowRunDescription,
    /* Zod 4 ZodObject not assignable to SDK AnySchema (zod/v4/core) after zod update */
    // @ts-expect-error TS2322
    inputSchema,
  },
  async ({ script }: WorkflowRunInput) => {
    const resolved = Workflow.resolve(root, script);
    if (!resolved.ok) {
      return { content: [{ text: resolved.error, type: `text` as const }] };
    }
    if (resolved.command === `__dev_all__`) {
      const exitCode = await RunAll.runDev(root);

      return { content: [{ text: `Dev exited with code ${exitCode}.`, type: `text` as const }] };
    }
    if (resolved.command === `__run_all__`) {
      const exitCode = await RunAll.runProd(root);

      return { content: [{ text: `Run exited with code ${exitCode}.`, type: `text` as const }] };
    }
    const devTimeoutMs = 600_000;
    const isDev = script === `dev`;

    const result = await Run.run(root, resolved.command, {
      stdio: isDev ? `inherit` : `pipe`,
      timeoutMs: isDev ? devTimeoutMs : undefined,
    });

    const text = isDev ? `Dev server exited with code ${result.exitCode}.` : Run.formatResult(script, result);

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
