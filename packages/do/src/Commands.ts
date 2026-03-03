import type { CmdDefinition } from "./CommandTypes";

const defs: Record<string, CmdDefinition> = {
  [`build:app`]: { description: `Vite: build app bundle.`, label: `📱 App`, run: { handler: `build:app` } },
  [`build:site`]: { description: `Vite: build site.`, label: `🌐 Site`, run: { handler: `build:site` } },
  [`build:ssr`]: { description: `Vite: build SSR bundle.`, label: `⚡ SSR`, run: { handler: `build:ssr` } },
  [`db:container:up`]: {
    description: `Docker: start DB container.`,
    label: `🐳 Database container`,
    run: { command: `docker compose up -d` },
  },
  [`db:dev`]: {
    children: [`db:container:up`, `db:push:dev`, `db:seed`],
    description: `DB for dev/run: container up + schema push + seed.`,
    label: `🗄️  Database`,
  },
  [`db:generate`]: {
    description: `Prisma: generate client.`,
    label: `📜 Generate Prisma client`,
    run: { args: [`generate`], tool: `prisma` },
  },
  [`db:migrate:deploy`]: {
    description: `Prisma: apply migrations.`,
    label: `📥 Apply migrations`,
    run: { args: [`migrate`, `deploy`], tool: `prisma` },
  },
  [`db:migrate:dev`]: {
    description: `Prisma: create migration.`,
    label: `➕ Create migration`,
    run: { args: [`migrate`, `dev`], tool: `prisma` },
  },
  [`db:migrate:reset`]: {
    description: `Prisma: reset DB.`,
    label: `♻️ Reset database`,
    run: { args: [`migrate`, `reset`], tool: `prisma` },
  },
  [`db:push:dev`]: {
    description: `Prisma: push schema (accept data loss, for dev/run).`,
    label: `⬇️  Schema sync`,
    run: { args: [`db`, `push`, `--accept-data-loss`], tool: `prisma` },
  },
  [`db:push`]: {
    description: `Prisma: push schema.`,
    label: `📤 Push schema`,
    run: { args: [`db`, `push`], tool: `prisma` },
  },
  [`db:seed`]: {
    description: `Prisma: seed DB.`,
    label: `🌱 Seed database`,
    run: { args: [`db`, `seed`], tool: `prisma` },
  },
  [`db:studio`]: {
    description: `Prisma: Studio GUI.`,
    label: `🖼️ Prisma Studio`,
    run: { args: [`studio`], tool: `prisma` },
  },
  [`deploy-prepare`]: {
    children: [`build`, `db:migrate:deploy`],
    description: `Build + apply migrations (for deploy or before run).`,
    label: `🔨 Deploy prepare`,
  },
  [`deploy-run`]: {
    children: [`server:prod`],
    description: `Run prod server only (after deploy-prepare).`,
    label: `▶️ Deploy run`,
  },
  [`eslint-fix`]: {
    description: `ESLint: auto-fix.`,
    label: `🔧 ESLint`,
    run: { args: [`--fix`, `.`], tool: `eslint` },
  },
  [`prettier-fix`]: {
    description: `Prettier: format and write.`,
    label: `✨ Prettier`,
    run: { args: [`--write`, `.`], tool: `prettier` },
  },
  [`server:api:dev`]: {
    description: `Run server-dev (API).`,
    label: `⚙️  API dev`,
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
    label: `🏭 Server`,
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
  [`stylelint-fix`]: {
    description: `Stylelint: auto-fix.`,
    label: `🎨 Stylelint`,
    run: { args: [`--fix`, `--max-warnings=0`, `**/*.scss`], tool: `stylelint` },
  },
  build: {
    children: [`build:site`, `build:app`, `build:ssr`],
    description: `Build site into dist/www (site + app + ssr).`,
    label: `📦 Build`,
  },
  ci: { children: [`test`, `lint`, `build`], description: `Test + lint + build.`, label: `🔁 CI` },
  cspell: { description: `CSpell: spell-check.`, label: `📝 CSpell`, run: { args: [`.`], tool: `cspell` } },
  dev: { children: [`db:dev`, `server:dev`], description: `Run server in watch (server-dev).`, label: `🚀 Dev server` },
  eslint: { description: `ESLint: lint JS/TS.`, label: `🔍 ESLint`, run: { args: [`.`], tool: `eslint` } },
  jscpd: { description: `JSCPD: copy-paste detection.`, label: `📋 JSCPD`, run: { args: [`.`], tool: `jscpd` } },
  knip: { description: `Knip: unused code, deps, exports.`, label: `🧹 Knip`, run: { args: [], tool: `knip` } },
  lint: {
    children: [`tsc`, `eslint`, `prettier`, `stylelint`, `cspell`, `jscpd`, `knip`, `markdownlint`],
    description: `TypeScript, ESLint, Prettier, Stylelint, CSpell, JSCPD, Knip, Markdown.`,
    label: `🛡️  Lint`,
  },
  markdownlint: {
    description: `Markdownlint: lint markdown.`,
    label: `📄 Markdown`,
    run: { args: [`.`], tool: `markdownlint` },
  },
  prettier: {
    description: `Prettier: check formatting.`,
    label: `✨ Prettier`,
    run: { args: [`--check`, `.`], tool: `prettier` },
  },
  run: {
    children: [`deploy-prepare`, `deploy-run`],
    description: `Deploy prepare + deploy run. Use locally or under PM2.`,
    label: `🏃 Run`,
  },
  stylelint: {
    description: `Stylelint: lint CSS/SCSS.`,
    label: `🎨 Stylelint`,
    run: { args: [`--max-warnings=0`, `**/*.scss`], tool: `stylelint` },
  },
  test: { description: `Vitest: run tests.`, label: `🧪 Test`, run: { args: [`run`], tool: `vitest` } },
  tsc: { description: `TypeScript: type-check.`, label: `📘 TypeScript`, run: { args: [`--noEmit`], tool: `tsc` } },
};

const byName = (name: string): CmdDefinition | undefined => defs[name];

const list = (): { description: string; name: string }[] =>
  Object.entries(defs).map(([name, definition]) => ({ description: definition.description, name }));

export const Commands = { byName, list };
