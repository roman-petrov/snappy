/* eslint-disable functional/no-expression-statements */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import { Unicode } from "@snappy/core";
import { z } from "zod";

import type { McpTool } from "../Types";

import { CommandRegistry } from "../../CommandRegistry";
import { Runner } from "../../Runner";

export const McpToolWorkflowRun: McpTool = (server, { root }) => {
  const scripts = CommandRegistry.filter(
    command => command.mcp !== false && !(`interactive` in command && command.interactive === true),
  );

  const inputSchema = z.object({
    script: z
      .enum(scripts.map(command => command.name) as [string, ...string[]])
      .describe(scripts.map(({ description, name }) => `${name}: ${description}`).join(`\n`)),
  });

  server.registerTool(
    `workflow_run`,
    {
      description: [
        `Run one monorepo script by name from the script field (each entry is name: what it does).`,
        `Use the smallest script that fits.`,
        `Names ending in -fix apply fixes; the same name without -fix only checks.`,
        `Composite scripts run steps in order; on failure, fix and run again.`,
        `Long-running scripts start in the background and return immediately with local URLs.`,
      ].join(` `),
      inputSchema,
    },
    async ({ script }) => {
      const resolved = Runner.resolveCommand(script);

      return resolved.ok
        ? {
            content: [
              {
                text: Unicode.stripAnsi((await Runner.run(root, resolved.name, { mcp: true })).message),
                type: `text` as const,
              },
            ],
          }
        : { content: [{ text: resolved.error, type: `text` as const }] };
    },
  );
};
