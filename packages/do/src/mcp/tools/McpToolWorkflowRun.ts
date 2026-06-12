/* eslint-disable functional/no-expression-statements */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import { Console } from "@snappy/node";
import { z } from "zod";

import type { McpTool } from "../Types";

import { Commands } from "../../Commands";
import { Runner } from "../../Runner";

export const McpToolWorkflowRun: McpTool = server => {
  const fromEnv = process.env[`MCP_SERVER_ROOT`];
  const root = fromEnv !== undefined && fromEnv !== `` ? fromEnv : Runner.repoRoot;

  const scripts = Commands.list().filter(({ name }) => {
    const definition = Commands.byName(name);

    return definition.mcp !== false && !(`interactive` in definition && definition.interactive === true);
  });

  const inputSchema = z.object({
    script: z
      .enum(scripts.map(command => command.name) as [string, ...string[]])
      .describe(scripts.map(({ description, name }) => `${name}: ${description}`).join(`\n`)),
  });

  server.registerTool(
    `workflow_run`,
    {
      description: [
        `Run one project script.`,
        `Pick script by name from the script field (each entry is name: what it does).`,
        `Use the smallest script that fits the task.`,
        `Names ending in -fix fix issues; the same name without -fix checks.`,
        `Composite scripts run steps in order; if a step fails, fix and run again.`,
        `Long-running scripts start in the background and return at once with local URLs in the response; keep working while they run.`,
      ].join(` `),
      inputSchema,
    },
    async ({ script }) => {
      const resolved = Runner.resolveCommand(script);

      return resolved.ok
        ? {
            content: [
              {
                text: Console.stripAnsi((await Runner.run(root, resolved.name, { mcp: true })).message),
                type: `text` as const,
              },
            ],
          }
        : { content: [{ text: resolved.error, type: `text` as const }] };
    },
  );
};
