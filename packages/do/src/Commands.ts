import type { CmdDefinition } from "./CommandTypes";

const defs: Record<string, CmdDefinition> = {
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
  [`build:app`]: { description: `Vite: build app bundle.`, label: `📦 App`, run: { handler: `build:app` } },
  [`build:site`]: { description: `Vite: build site.`, label: `📦 Site`, run: { handler: `build:site` } },
  [`build:ssr`]: { description: `Vite: build SSR bundle.`, label: `📦 SSR`, run: { handler: `build:ssr` } },
  [`deploy-prepare`]: {
    children: [`build`, `db:migrate:deploy`],
    description: `Build + apply migrations (for deploy or before run).`,
    label: `📦 Deploy prepare`,
  },
  [`deploy-run`]: {
    children: [`server:prod`],
    description: `Run prod server only (after deploy-prepare).`,
    label: `▶️ Deploy run`,
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
    run: { args: [`--fix`, `--max-warnings=0`, `**/*.scss`], tool: `stylelint` },
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
    run: { args: [`--max-warnings=0`, `**/*.scss`], tool: `stylelint` },
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
    description: `Run prod server (tsx).`,
    label: `🖥️ Server`,
    run: {
      command: `bunx tsx packages/server-prod/src/main.ts`,
      cwd: `.`,
      shutdown: { command: `docker compose down` },
    },
  },
  [`server:site:dev`]: {
    description: `Run snappy-site dev server.`,
    label: `🌐 Site dev`,
    run: { background: true, command: `node --import tsx/esm server.ts`, cwd: `packages/snappy-site` },
  },
  build: {
    children: [`build:site`, `build:app`, `build:ssr`],
    description: `Build site into dist/www (site + app + ssr).`,
    label: `📦 Build`,
  },
  ci: {
    children: [`test`, `lint`, `build`],
    description: `Full CI pipeline: test + all linters + build.`,
    label: `🔄 CI pipeline`,
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
    children: [`deploy-prepare`, `deploy-run`],
    description: `Deploy prepare + deploy run. Use locally or under PM2.`,
    label: `▶️ Run`,
  },
  test: { description: `Run tests via vitest.`, label: `🧪 Tests`, run: { args: [`run`], tool: `vitest` } },
};

const byName = (name: string): CmdDefinition | undefined => defs[name];

const list = (): { description: string; name: string }[] =>
  Object.entries(defs).map(([name, definition]) => ({ description: definition.description, name }));

export const Commands = { byName, list };
