import { Process } from "@snappy/node";

import { Build } from "./Build";
import { Run } from "./Run";
import { RunAll } from "./RunAll";

const runner = `bun` as const;
const cmd = (tool: string, args: string[]) => Process.toolCommand(runner, tool, args);

const lintSteps = [
  `lint:tsc`,
  `lint:eslint`,
  `lint:prettier`,
  `lint:stylelint`,
  `lint:cspell`,
  `lint:jscpd`,
  `lint:knip`,
  `lint:markdown`,
] as const;

type CommandDefinition = CompositeDefinition | LeafDefinition;

type CompositeDefinition = { children: readonly string[]; description: string; label: string; type: `composite` };

type ExecuteFn = (root: string) => Promise<RunResult>;

type LeafDefinition = { description: string; execute: ExecuteFn; interactive?: boolean; label: string; type: `leaf` };

type RunResult = { exitCode: number; message: string };

const shellExecute =
  (name: string, command: string): ExecuteFn =>
  async root => {
    const result = await Run.run(root, command, { stdio: `pipe` });
    const message = result.exitCode === 0 ? `` : Run.formatResult(name, result);

    return { exitCode: result.exitCode, message };
  };

const defs: Record<string, CommandDefinition> = {
  [`db:generate`]: {
    description: `Prisma: generate client.`,
    execute: shellExecute(`db:generate`, cmd(`prisma`, [`generate`])),
    label: `🗄️ Generate Prisma client`,
    type: `leaf`,
  },
  [`db:migrate:deploy`]: {
    description: `Prisma: apply migrations.`,
    execute: shellExecute(`db:migrate:deploy`, cmd(`prisma`, [`migrate`, `deploy`])),
    label: `🗄️ Apply migrations`,
    type: `leaf`,
  },
  [`db:migrate:dev`]: {
    description: `Prisma: create migration.`,
    execute: shellExecute(`db:migrate:dev`, cmd(`prisma`, [`migrate`, `dev`])),
    label: `🗄️ Create migration`,
    type: `leaf`,
  },
  [`db:migrate:reset`]: {
    description: `Prisma: reset DB.`,
    execute: shellExecute(`db:migrate:reset`, cmd(`prisma`, [`migrate`, `reset`])),
    label: `🗄️ Reset database`,
    type: `leaf`,
  },
  [`db:push`]: {
    description: `Prisma: push schema.`,
    execute: shellExecute(`db:push`, cmd(`prisma`, [`db`, `push`])),
    label: `🗄️ Push schema`,
    type: `leaf`,
  },
  [`db:seed`]: {
    description: `Prisma: seed DB.`,
    execute: shellExecute(`db:seed`, cmd(`prisma`, [`db`, `seed`])),
    label: `🗄️ Seed database`,
    type: `leaf`,
  },
  [`db:studio`]: {
    description: `Prisma: Studio GUI.`,
    execute: shellExecute(`db:studio`, cmd(`prisma`, [`studio`])),
    label: `🗄️ Prisma Studio`,
    type: `leaf`,
  },
  [`fix:eslint`]: {
    description: `ESLint: auto-fix.`,
    execute: shellExecute(`fix:eslint`, cmd(`eslint`, [`--fix`, `.`])),
    label: `🔧 ESLint auto-fix`,
    type: `leaf`,
  },
  [`fix:prettier`]: {
    description: `Prettier: format and write.`,
    execute: shellExecute(`fix:prettier`, cmd(`prettier`, [`--write`, `.`])),
    label: `✨ Prettier format`,
    type: `leaf`,
  },
  [`fix:stylelint`]: {
    description: `Stylelint: auto-fix.`,
    execute: shellExecute(`fix:stylelint`, cmd(`stylelint`, [`--fix`, `--max-warnings=0`, `**/*.css`])),
    label: `🎨 Stylelint auto-fix`,
    type: `leaf`,
  },
  [`lint:cspell`]: {
    description: `CSpell: spell-check.`,
    execute: shellExecute(`lint:cspell`, cmd(`cspell`, [`.`])),
    label: `📝 Spell-check`,
    type: `leaf`,
  },
  [`lint:eslint`]: {
    description: `ESLint: lint source code.`,
    execute: shellExecute(`lint:eslint`, cmd(`eslint`, [`.`])),
    label: `🔍 ESLint`,
    type: `leaf`,
  },
  [`lint:jscpd`]: {
    description: `JSCPD: detect duplication.`,
    execute: shellExecute(`lint:jscpd`, cmd(`jscpd`, [`.`])),
    label: `📋 Detect duplication`,
    type: `leaf`,
  },
  [`lint:knip`]: {
    description: `Knip: unused files, deps, exports.`,
    execute: shellExecute(`lint:knip`, cmd(`knip`, [])),
    label: `🧹 Unused code`,
    type: `leaf`,
  },
  [`lint:markdown`]: {
    description: `Markdownlint: lint markdown.`,
    execute: shellExecute(`lint:markdown`, cmd(`markdownlint`, [`.`])),
    label: `📄 Markdown lint`,
    type: `leaf`,
  },
  [`lint:prettier`]: {
    description: `Prettier: check formatting.`,
    execute: shellExecute(`lint:prettier`, cmd(`prettier`, [`--check`, `.`])),
    label: `✨ Check formatting`,
    type: `leaf`,
  },
  [`lint:stylelint`]: {
    description: `Stylelint: lint CSS/SCSS.`,
    execute: shellExecute(`lint:stylelint`, cmd(`stylelint`, [`--max-warnings=0`, `**/*.css`])),
    label: `🎨 CSS lint`,
    type: `leaf`,
  },
  [`lint:tsc`]: {
    description: `TypeScript: type-check only.`,
    execute: shellExecute(`lint:tsc`, cmd(`tsc`, [`--noEmit`])),
    label: `📘 Type-check`,
    type: `leaf`,
  },
  build: {
    description: `Build server into dist/server.js, static into dist/www.`,
    execute: async root => {
      const exitCode = await Build.build(root);

      return { exitCode, message: exitCode === 0 ? `` : `Build failed.` };
    },
    label: `📦 Build`,
    type: `leaf`,
  },
  ci: {
    children: [`test`, `lint`, `build`],
    description: `Full CI pipeline: test + all linters + build.`,
    label: `🔄 CI pipeline`,
    type: `composite`,
  },
  dev: {
    description: `Run server in watch (server-dev).`,
    execute: async root => {
      const exitCode = await RunAll.runDev(root);

      return { exitCode, message: `Dev exited with code ${exitCode}.` };
    },
    interactive: true,
    label: `🚀 Dev server`,
    type: `leaf`,
  },
  lint: {
    children: [...lintSteps],
    description: `All linters: tsc, eslint, prettier, stylelint, cspell, jscpd, knip, markdown.`,
    label: `📋 All linters`,
    type: `composite`,
  },
  run: {
    description: `Build and run server (server-prod → node dist/server.js).`,
    execute: async root => {
      const exitCode = await RunAll.runProd(root);

      return { exitCode, message: `Run exited with code ${exitCode}.` };
    },
    interactive: true,
    label: `▶️ Run prod`,
    type: `leaf`,
  },
  test: {
    description: `Run tests via vitest.`,
    execute: shellExecute(`test`, cmd(`vitest`, [`run`])),
    label: `🧪 Tests`,
    type: `leaf`,
  },
};

const byName = (name: string): CommandDefinition | undefined => defs[name];

const list = (): { description: string; name: string }[] =>
  Object.entries(defs).map(([name, definition]) => ({ description: definition.description, name }));

export const Commands = { byName, list };
