import { _ } from "@snappy/core";

import type { CommandDefinition } from "./CommandTypes";

const tsxPreload = `--import tsx/esm --require tsx/cjs`;

const defs = {
  [`build:admin`]: { description: `Build admin for production.`, label: `🛡️ Admin`, run: { handler: `build:admin` } },
  [`build:app-android-debug`]: {
    description: `Build debug Android app for local testing.`,
    label: `🤖 Android debug`,
    run: { handler: `build:app-android-debug` },
  },
  [`build:app-android`]: {
    description: `Build Android app for production.`,
    label: `🤖 Android app`,
    run: { handler: `build:app-android` },
  },
  [`build:app`]: { description: `Build app for production.`, label: `💻 App`, run: { handler: `build:app` } },
  [`build:server`]: {
    description: `Build API server for production.`,
    label: `🏭 Server`,
    run: { handler: `build:server` },
  },
  [`build:site`]: { description: `Build site for production.`, label: `🌐 Site`, run: { handler: `build:site` } },
  [`build:ssr`]: { description: `Build site SSR for production.`, label: `⚡ SSR`, run: { handler: `build:ssr` } },
  [`db:container:up`]: {
    description: `Start local database.`,
    label: `🐳 Database container`,
    run: { handler: `db:container:up` },
  },
  [`db:dev`]: {
    children: [`db:container:up`, `db:push:dev`],
    description: `Set up local database for development.`,
    label: `🗄️ Database`,
  },
  [`db:migrate:deploy`]: {
    description: `Run database migrations on server.`,
    label: `📥 Apply migrations`,
    run: { args: [`migrate`, `deploy`], tool: `prisma` },
  },
  [`db:push:dev`]: {
    description: `Sync local database schema for development.`,
    label: `⬇️ Schema sync`,
    run: { args: [`db`, `push`, `--accept-data-loss`], tool: `prisma` },
  },
  [`docker:start`]: {
    description: `Start Docker for development.`,
    label: `🐳 Docker`,
    run: { command: `docker desktop start` },
  },
  [`env:dev`]: {
    children: [`docker:start`, `db:dev`],
    description: `Set up Docker and local database for development.`,
    label: `🧰 Dev env`,
  },
  [`eslint-fix`]: {
    description: `Fix ESLint issues.`,
    label: `🔧 ESLint`,
    run: { args: [`--fix`, `--max-warnings=0`, `.`], tool: `eslint` },
  },
  [`finish-feature`]: {
    description: `Prepare feature branch to merge into main.`,
    interactive: true,
    label: `🏁 Finish feature`,
    run: { handler: `finish-feature` },
  },
  [`java-format-fix`]: {
    description: `Fix Java format issues.`,
    label: `☕ Java format fix`,
    run: { handler: `java-format-fix` },
  },
  [`java-format`]: {
    description: `Check Java format issues.`,
    label: `☕ Java format`,
    run: { handler: `java-format` },
  },
  [`prettier-fix`]: {
    description: `Fix Prettier issues.`,
    label: `✨ Prettier`,
    run: { args: [`--write`, `.`], tool: `prettier` },
  },
  [`server:dev`]: {
    children: [`server:frontend:dev`],
    description: `Run site, app, admin, and API in development.`,
    label: `🖥️ Server`,
  },
  [`server:frontend:dev`]: {
    description: `Run site, app, and admin in development.`,
    label: `🌐 Site + App + Admin`,
    run: { background: true, command: `node ${tsxPreload} packages/do-dev/src/main.ts`, cwd: `.` },
  },
  [`server:prod`]: {
    description: `Run API server in production.`,
    label: `🏭 Server run`,
    run: { command: `node dist/server/main.js`, cwd: `.`, shutdown: { command: `docker compose down` } },
  },
  [`stylelint-fix`]: {
    description: `Fix Stylelint issues.`,
    label: `🎨 Stylelint`,
    run: { args: [`--fix`, `--max-warnings=0`, `**/*.scss`], tool: `stylelint` },
  },
  build: {
    children: [`build:site`, `build:ssr`, `build:app`, `build:admin`, `build:server`, `build:app-android`],
    description: `Build site, SSR, app, admin, API server, and Android app for production.`,
    label: `📦 Build`,
  },
  cert: { description: `Set up HTTPS for local development.`, label: `🔐 Dev TLS`, run: { handler: `cert` } },
  ci: {
    children: [`test`, `lint`, `build`],
    description: `Run tests, check, and build for production.`,
    label: `🔁 CI`,
  },
  cspell: { description: `Check CSpell issues.`, label: `📝 CSpell`, run: { args: [`.`], tool: `cspell` } },
  decrypt: {
    description: `Decrypt secrets.prod.enc.yaml to secrets.prod.yaml.`,
    interactive: true,
    label: `📤 Decrypt prod secrets`,
    run: { handler: `decrypt` },
  },
  dev: {
    children: [`env:dev`, `server:dev`],
    description: `Set up development environment and run servers.`,
    label: `🚀 Dev server`,
  },
  encrypt: {
    description: `Generate key and encrypt secrets.prod.yaml to secrets.prod.enc.yaml.`,
    interactive: true,
    label: `🔒 Encrypt prod secrets`,
    run: { handler: `encrypt` },
  },
  eslint: {
    description: `Check ESLint issues.`,
    label: `🔍 ESLint`,
    run: { args: [`--max-warnings=0`, `.`], tool: `eslint` },
  },
  jscpd: { description: `Check JSCPD issues.`, label: `📋 JSCPD`, run: { args: [`.`], tool: `jscpd` } },
  knip: { description: `Check Knip issues.`, label: `🧹 Knip`, run: { args: [], tool: `knip` } },
  lint: {
    children: [`tsc`, `eslint`, `prettier`, `java-format`, `stylelint`, `cspell`, `knip`, `markdownlint`, `jscpd`],
    description: `Check all.`,
    label: `🛡️ Lint`,
  },
  markdownlint: {
    description: `Check Markdownlint issues.`,
    label: `📄 Markdown`,
    run: { args: [`.`], tool: `markdownlint` },
  },
  prettier: {
    description: `Check Prettier issues.`,
    label: `✨ Prettier`,
    run: { args: [`--check`, `.`], tool: `prettier` },
  },
  run: {
    children: [`env:dev`, `build`, `server:prod`],
    description: `Build for production and run locally.`,
    label: `🏃 Run`,
  },
  shot: { description: `Update test snapshots.`, label: `📸 Shot`, run: { args: [`run`, `--update`], tool: `vitest` } },
  stylelint: {
    description: `Check Stylelint issues.`,
    label: `🎨 Stylelint`,
    run: { args: [`--max-warnings=0`, `**/*.scss`], tool: `stylelint` },
  },
  test: { description: `Run tests.`, label: `🧪 Test`, run: { args: [`run`], tool: `vitest` } },
  tsc: { description: `Check TypeScript issues.`, label: `📘 TypeScript`, run: { args: [`--noEmit`], tool: `tsc` } },
} satisfies Record<string, CommandDefinition>;

export type CommandName = keyof typeof defs;

const has = (name: string): name is CommandName => Object.hasOwn(defs, name);
const byName = (name: CommandName): CommandDefinition => defs[name];
const list = () => _.entries(defs).map(([name, definition]) => ({ description: definition.description, name }));

export const Commands = { byName, has, list };
