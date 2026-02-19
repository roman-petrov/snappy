import type { CmdDefinition } from "./CommandTypes";

const defs: Record<string, CmdDefinition> = {
  [`codegen:site`]: {
    description: `Panda CSS: generate styled-system in snappy-site.`,
    label: `🎨 Panda codegen (site)`,
    run: { command: `bunx panda codegen`, cwd: `packages/snappy-site` },
  },
  [`codegen:ui`]: {
    description: `Panda CSS: generate styled-system in ui.`,
    label: `🎨 Panda codegen (ui)`,
    run: { command: `bunx panda codegen`, cwd: `packages/ui` },
  },
  [`db:container:up`]: {
    description: `Docker: start DB container.`,
    label: `🐳 Database container`,
    run: { command: `docker compose up -d` },
  },
  [`db:dev`]: {
    children: [`db:container:up`, `db:push:dev`, `db:seed`],
    description: `DB for dev/run: container up + schema push + seed.`,
    label: `🗄️ Database`,
  },
  [`db:generate`]: {
    description: `Prisma: generate client.`,
    label: `🗄️ Generate Prisma client`,
    run: { args: [`generate`], tool: `prisma` },
  },
  [`db:migrate:deploy`]: {
    description: `Prisma: apply migrations.`,
    label: `🗄️ Apply migrations`,
    run: { args: [`migrate`, `deploy`], tool: `prisma` },
  },
  [`db:migrate:dev`]: {
    description: `Prisma: create migration.`,
    label: `🗄️ Create migration`,
    run: { args: [`migrate`, `dev`], tool: `prisma` },
  },
  [`db:migrate:reset`]: {
    description: `Prisma: reset DB.`,
    label: `🗄️ Reset database`,
    run: { args: [`migrate`, `reset`], tool: `prisma` },
  },
  [`db:push:dev`]: {
    description: `Prisma: push schema (accept data loss, for dev/run).`,
    label: `🗄️ Schema sync`,
    run: { args: [`db`, `push`, `--accept-data-loss`], tool: `prisma` },
  },
  [`db:push`]: {
    description: `Prisma: push schema.`,
    label: `🗄️ Push schema`,
    run: { args: [`db`, `push`], tool: `prisma` },
  },
  [`db:seed`]: {
    description: `Prisma: seed DB.`,
    label: `🗄️ Seed database`,
    run: { args: [`db`, `seed`], tool: `prisma` },
  },
  [`db:studio`]: {
    description: `Prisma: Studio GUI.`,
    label: `🗄️ Prisma Studio`,
    run: { args: [`studio`], tool: `prisma` },
  },
  [`fix:eslint`]: {
    description: `ESLint: auto-fix.`,
    label: `🔧 ESLint auto-fix`,
    run: { args: [`--fix`, `.`], tool: `eslint` },
  },
  [`fix:prettier`]: {
    description: `Prettier: format and write.`,
    label: `✨ Prettier format`,
    run: { args: [`--write`, `.`], tool: `prettier` },
  },
  [`fix:stylelint`]: {
    description: `Stylelint: auto-fix.`,
    label: `🎨 Stylelint auto-fix`,
    run: { args: [`--fix`, `--max-warnings=0`, `**/*.css`], tool: `stylelint` },
  },
  [`lint:cspell`]: {
    description: `CSpell: spell-check.`,
    label: `📝 Spell-check`,
    run: { args: [`.`], tool: `cspell` },
  },
  [`lint:eslint`]: {
    description: `ESLint: lint source code.`,
    label: `🔍 ESLint`,
    run: { args: [`.`], tool: `eslint` },
  },
  [`lint:jscpd`]: {
    description: `JSCPD: detect duplication.`,
    label: `📋 Detect duplication`,
    run: { args: [`.`], tool: `jscpd` },
  },
  [`lint:knip`]: {
    description: `Knip: unused files, deps, exports.`,
    label: `🧹 Unused code`,
    run: { args: [], tool: `knip` },
  },
  [`lint:markdown`]: {
    description: `Markdownlint: lint markdown.`,
    label: `📄 Markdown lint`,
    run: { args: [`.`], tool: `markdownlint` },
  },
  [`lint:prettier`]: {
    description: `Prettier: check formatting.`,
    label: `✨ Check formatting`,
    run: { args: [`--check`, `.`], tool: `prettier` },
  },
  [`lint:stylelint`]: {
    description: `Stylelint: lint CSS/SCSS.`,
    label: `🎨 CSS lint`,
    run: { args: [`--max-warnings=0`, `**/*.css`], tool: `stylelint` },
  },
  [`lint:tsc`]: {
    description: `TypeScript: type-check only.`,
    label: `📘 Type-check`,
    run: { args: [`--noEmit`], tool: `tsc` },
  },
  [`server:api:dev`]: {
    description: `Run server-dev (API).`,
    label: `⚙️ API dev`,
    run: {
      command: `node --watch --import tsx/esm packages/server-dev/src/main.ts`,
      cwd: `.`,
      env: { NODE_ENV: `development` },
      openUrl: `http://localhost:5173`,
      shutdown: { command: `docker compose down` },
    },
  },
  [`server:dev`]: {
    children: [`server:site:dev`, `server:api:dev`],
    description: `Run dev servers (snappy-site + server-dev).`,
    label: `🖥️ Servers`,
  },
  [`server:prod`]: {
    description: `Run prod server (node dist/server.js).`,
    label: `🖥️ Server`,
    run: { command: `node dist/server.js`, cwd: `.`, shutdown: { command: `docker compose down` } },
  },
  [`server:site:dev`]: {
    description: `Run snappy-site dev server.`,
    label: `🌐 Site dev`,
    run: { background: true, command: `npm run dev`, cwd: `packages/snappy-site` },
  },
  build: {
    description: `Build server into dist/server.js, static into dist/www.`,
    label: `📦 Build`,
    run: { handler: `build` },
  },
  ci: {
    children: [`codegen`, `test`, `lint`, `build`],
    description: `Full CI pipeline: codegen + test + all linters + build.`,
    label: `🔄 CI pipeline`,
  },
  codegen: {
    children: [`codegen:ui`, `codegen:site`],
    description: `Panda CSS: generate styled-system in ui and snappy-site.`,
    label: `🎨 Panda codegen`,
  },
  dev: { children: [`db:dev`, `server:dev`], description: `Run server in watch (server-dev).`, label: `🚀 Dev server` },
  lint: {
    children: [
      `lint:tsc`,
      `lint:eslint`,
      `lint:prettier`,
      `lint:stylelint`,
      `lint:cspell`,
      `lint:jscpd`,
      `lint:knip`,
      `lint:markdown`,
    ],
    description: `All linters: tsc, eslint, prettier, stylelint, cspell, jscpd, knip, markdown.`,
    label: `📋 All linters`,
  },
  run: {
    children: [`build`, `db:dev`, `server:prod`],
    description: `Build and run server (server-prod → node dist/server.js).`,
    label: `▶️ Run prod`,
  },
  test: { description: `Run tests via vitest.`, label: `🧪 Tests`, run: { args: [`run`], tool: `vitest` } },
};

const byName = (name: string): CmdDefinition | undefined => defs[name];

const list = (): { description: string; name: string }[] =>
  Object.entries(defs).map(([name, definition]) => ({ description: definition.description, name }));

export const Commands = { byName, list };
