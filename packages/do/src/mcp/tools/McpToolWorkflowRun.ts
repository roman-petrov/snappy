/* eslint-disable functional/no-expression-statements */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import { Console } from "@snappy/node";
import { z } from "zod";

import type { McpTool } from "../Types";

import { type CommandName, Commands } from "../../Commands";
import { Runner } from "../../Runner";
import { Scripts } from "../../Scripts";

export const McpToolWorkflowRun: McpTool = server => {
  const root = Scripts.rootDir();

  const scriptNames = [
    `build`,
    `build:app`,
    `build:app-android`,
    `build:app-android-debug`,
    `build:server`,
    `build:site`,
    `build:ssr`,
    `ci`,
    `cspell`,
    `deploy-run`,
    `docker:start`,
    `eslint`,
    `eslint-fix`,
    `java-format`,
    `java-format-fix`,
    `jscpd`,
    `knip`,
    `lint`,
    `markdownlint`,
    `prettier`,
    `prettier-fix`,
    `server:api:dev`,
    `server:dev`,
    `server:frontend:dev`,
    `server:prod`,
    `shot`,
    `stylelint`,
    `stylelint-fix`,
    `test`,
    `tsc`,
  ] as const satisfies readonly CommandName[];

  const scripts = scriptNames.map(name => ({ description: Commands.byName(name).description, name }));

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
