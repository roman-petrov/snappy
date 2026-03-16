import type { CmdDefinition } from "./CommandTypes";

const nodeLoaderPath = `src/NodeLoader.js`;

/**
 * ! Some emojis have incorrect width in VSCode terminal.
 * ? See:
 * ? - https://github.com/microsoft/vscode/issues/251102
 * ? - https://github.com/xtermjs/xterm.js/issues/2668
 */
const defs: Record<string, CmdDefinition> = {
  [`build:app-android-debug`]: {
    description: `Gradle: build Android debug APK (dev URL). Manual only, not part of build/ci.`,
    label: `🤖 Android debug`,
    run: { handler: `build:app-android-debug` },
  },
  [`build:app-android`]: {
    description: `Gradle: build Android release APK (prod URL) into dist/snappy.apk.`,
    label: `🤖 Android app`,
    run: { handler: `build:app-android` },
  },
  [`build:app`]: { description: `Vite: build app into dist/app.`, label: `💻 App`, run: { handler: `build:app` } },
  [`build:site`]: { description: `Vite: build site.`, label: `🌐 Site`, run: { handler: `build:site` } },
  [`build:ssr`]: { description: `Vite: build SSR bundle.`, label: `⚡ SSR`, run: { handler: `build:ssr` } },
  [`db:container:up`]: {
    description: `Docker: start DB container.`,
    label: `🐳 Database container`,
    run: { command: `docker compose up -d` },
  },
  [`db:dev`]: {
    children: [`db:container:up`, `db:push:dev`],
    description: `DB for dev: container up + schema push.`,
    label: `🗄️ Database`,
  },
  [`db:migrate:deploy`]: {
    description: `Prisma: apply migrations.`,
    label: `📥 Apply migrations`,
    run: { args: [`migrate`, `deploy`], tool: `prisma` },
  },
  [`db:push:dev`]: {
    description: `Prisma: push schema (accept data loss, for dev).`,
    label: `⬇️ Schema sync`,
    run: { args: [`db`, `push`, `--accept-data-loss`], tool: `prisma` },
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
  [`docker:start`]: {
    description: `Start Docker Desktop (daemon) so containers can run.`,
    label: `🐳 Docker`,
    run: { command: `docker desktop start` },
  },
  [`eslint-fix`]: {
    description: `ESLint: auto-fix.`,
    label: `🔧 ESLint`,
    run: { args: [`--fix`, `--max-warnings=0`, `.`], tool: `eslint` },
  },
  [`prettier-fix`]: {
    description: `Prettier: format and write.`,
    label: `✨ Prettier`,
    run: { args: [`--write`, `.`], tool: `prettier` },
  },
  [`server:api:dev`]: {
    description: `Run server-dev (API).`,
    label: `⚙️ API dev`,
    run: {
      command: `node --watch --import ./packages/do/${nodeLoaderPath} --import tsx/esm packages/server-dev/src/main.ts`,
      cwd: `.`,
      env: { NODE_ENV: `development` },
      shutdown: { command: `docker compose down` },
    },
  },
  [`server:dev`]: {
    children: [`server:frontend:dev`],
    description: `Run dev server (site + app + API + bot on port 80).`,
    label: `🖥️ Server`,
  },
  [`server:frontend:dev`]: {
    description: `Run site + app dev server together (one port).`,
    label: `🌐 Site + App`,
    run: {
      background: true,
      command: `node --import ./${nodeLoaderPath} --import tsx/esm src/main.dev-server.ts`,
      cwd: `packages/do`,
    },
  },
  [`server:prod`]: {
    description: `Run prod server (tsx).`,
    label: `🏭 Server`,
    run: {
      command: `node --import ./packages/do/${nodeLoaderPath} --import tsx/esm packages/server-prod/src/main.ts`,
      cwd: `.`,
      shutdown: { command: `docker compose down` },
    },
  },
  [`stylelint-fix`]: {
    description: `Stylelint: auto-fix.`,
    label: `🎨 Stylelint`,
    run: { args: [`--fix`, `--max-warnings=0`, `**/*.scss`], tool: `stylelint` },
  },
  build: {
    children: [`build:site`, `build:ssr`, `build:app`, `build:app-android`],
    description: `Build site into dist (site + ssr + app + Android APK).`,
    label: `📦 Build`,
  },
  ci: { children: [`test`, `lint`, `build`], description: `Test + lint + build.`, label: `🔁 CI` },
  cspell: { description: `CSpell: spell-check.`, label: `📝 CSpell`, run: { args: [`.`], tool: `cspell` } },
  dev: {
    children: [`docker:start`, `db:dev`, `server:dev`],
    description: `Start Docker + DB + run server in watch (server-dev).`,
    label: `🚀 Dev server`,
  },
  eslint: {
    description: `ESLint: lint JS/TS.`,
    label: `🔍 ESLint`,
    run: { args: [`--max-warnings=0`, `.`], tool: `eslint` },
  },
  jscpd: { description: `JSCPD: copy-paste detection.`, label: `📋 JSCPD`, run: { args: [`.`], tool: `jscpd` } },
  knip: { description: `Knip: unused code, deps, exports.`, label: `🧹 Knip`, run: { args: [], tool: `knip` } },
  lint: {
    children: [`tsc`, `eslint`, `prettier`, `stylelint`, `cspell`, `jscpd`, `knip`, `markdownlint`],
    description: `TypeScript, ESLint, Prettier, Stylelint, CSpell, JSCPD, Knip, Markdown.`,
    label: `🛡️ Lint`,
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
  shot: {
    description: `Vitest: run tests and update snapshots.`,
    label: `📸 Shot`,
    run: { args: [`run`, `--update`], tool: `vitest` },
  },
  stylelint: {
    description: `Stylelint: lint CSS/SCSS.`,
    label: `🎨 Stylelint`,
    run: { args: [`--max-warnings=0`, `**/*.scss`], tool: `stylelint` },
  },
  test: { description: `Vitest: run tests.`, label: `🧪 Test`, run: { args: [`run`], tool: `vitest` } },
  tsc: { description: `TypeScript: type-check.`, label: `📘 TypeScript`, run: { args: [`--noEmit`], tool: `tsc` } },
};

const byName = (name: string) => defs[name];
const list = () => Object.entries(defs).map(([name, definition]) => ({ description: definition.description, name }));

export const Commands = { byName, list };
