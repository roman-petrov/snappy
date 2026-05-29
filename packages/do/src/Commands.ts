import type { CmdDefinition } from "./CommandTypes";

const tsxPreload = `--import tsx/esm --require tsx/cjs`;

const defs: Record<string, CmdDefinition> = {
  [`build:app-android-debug`]: {
    description: `Android build for development and testing on a device.`,
    label: `🤖 Android debug`,
    run: { handler: `build:app-android-debug` },
  },
  [`build:app-android`]: {
    description: `Android build for release and distribution.`,
    label: `🤖 Android app`,
    run: { handler: `build:app-android` },
  },
  [`build:app`]: {
    description: `Production build of the web application.`,
    label: `💻 App`,
    run: { handler: `build:app` },
  },
  [`build:server`]: {
    description: `Production build of the backend.`,
    label: `🏭 Server`,
    run: { handler: `build:server` },
  },
  [`build:site`]: {
    description: `Production build of the marketing site.`,
    label: `🌐 Site`,
    run: { handler: `build:site` },
  },
  [`build:ssr`]: {
    description: `Server rendering bundle for the marketing site.`,
    label: `⚡ SSR`,
    run: { handler: `build:ssr` },
  },
  [`db:container:up`]: {
    description: `Start the local database.`,
    label: `🐳 Database container`,
    mcp: false,
    run: { command: `docker compose up -d` },
  },
  [`db:dev`]: {
    children: [`db:container:up`, `db:push:dev`],
    description: `Prepare the database for local development.`,
    label: `🗄️ Database`,
    mcp: false,
  },
  [`db:migrate:deploy`]: {
    description: `Apply pending database changes on the server.`,
    label: `📥 Apply migrations`,
    mcp: false,
    run: { args: [`migrate`, `deploy`], tool: `prisma` },
  },
  [`db:push:dev`]: {
    description: `Align the local database with the current data model.`,
    label: `⬇️ Schema sync`,
    mcp: false,
    run: { args: [`db`, `push`, `--accept-data-loss`], tool: `prisma` },
  },
  [`deploy-prepare`]: {
    children: [`build`, `db:migrate:deploy`],
    description: `Prepare the project for deployment: build artifacts and update the database.`,
    label: `🔨 Deploy prepare`,
    mcp: false,
  },
  [`deploy-run`]: {
    children: [`server:prod`],
    description: `Start the application on the server after deployment.`,
    label: `▶️ Deploy run`,
  },
  [`docker:start`]: {
    description: `Start Docker for local services.`,
    label: `🐳 Docker`,
    run: { command: `docker desktop start` },
  },
  [`env:dev`]: {
    children: [`docker:start`, `db:dev`],
    description: `Prepare the local environment: Docker and database.`,
    label: `🧰 Dev env`,
    mcp: false,
  },
  [`eslint-fix`]: {
    description: `Automatically fix JavaScript and TypeScript style issues.`,
    label: `🔧 ESLint`,
    run: { args: [`--fix`, `--max-warnings=0`, `.`], tool: `eslint` },
  },
  [`finish-feature`]: {
    description: `Prepare the current feature branch for merge into main.`,
    interactive: true,
    label: `🏁 Finish feature`,
    mcp: false,
    run: { handler: `finish-feature` },
  },
  [`prettier-fix`]: {
    description: `Automatically format project code.`,
    label: `✨ Prettier`,
    run: { args: [`--write`, `.`], tool: `prettier` },
  },
  [`server:api:dev`]: {
    description: `Run the API locally with automatic restart on changes.`,
    label: `⚙️ API dev`,
    run: {
      command: `node --watch ${tsxPreload} packages/server-dev/src/main.ts`,
      cwd: `.`,
      env: { NODE_ENV: `development` },
      shutdown: { command: `docker compose down` },
    },
  },
  [`server:dev`]: {
    children: [`server:frontend:dev`],
    description: `Run dev server (site + app + API on port 80).`,
    label: `🖥️ Server`,
  },
  [`server:frontend:dev`]: {
    description: `Run site + app dev server together (one port).`,
    label: `🌐 Site + App`,
    run: { background: true, command: `node ${tsxPreload} src/main.dev-server.ts`, cwd: `packages/do` },
  },
  [`server:prod`]: {
    description: `Run dist/server-prod/main.js (after build:server).`,
    label: `🏭 Server run`,
    run: { command: `node dist/server-prod/main.js`, cwd: `.`, shutdown: { command: `docker compose down` } },
  },
  [`stylelint-fix`]: {
    description: `Stylelint: auto-fix.`,
    label: `🎨 Stylelint`,
    run: { args: [`--fix`, `--max-warnings=0`, `**/*.scss`], tool: `stylelint` },
  },
  build: {
    children: [`build:site`, `build:ssr`, `build:app`, `build:app-android`, `build:server`],
    description: `Build into dist (site + ssr + app + Android APK + server bundle).`,
    label: `📦 Build`,
  },
  cert: {
    description: `Prepare trusted HTTPS for local development.`,
    label: `🔐 Dev TLS`,
    mcp: false,
    run: { handler: `cert` },
  },
  ci: { children: [`test`, `lint`, `build`], description: `Test + lint + build.`, label: `🔁 CI` },
  cspell: { description: `CSpell: spell-check.`, label: `📝 CSpell`, run: { args: [`.`], tool: `cspell` } },
  dev: {
    children: [`env:dev`, `server:dev`],
    description: `Start Docker + DB + run server in watch (server-dev).`,
    label: `🚀 Dev server`,
    mcp: false,
  },
  eslint: {
    description: `ESLint: lint JS/TS.`,
    label: `🔍 ESLint`,
    run: { args: [`--max-warnings=0`, `.`], tool: `eslint` },
  },
  jscpd: { description: `JSCPD: copy-paste detection.`, label: `📋 JSCPD`, run: { args: [`.`], tool: `jscpd` } },
  knip: { description: `Knip: unused code, deps, exports.`, label: `🧹 Knip`, run: { args: [], tool: `knip` } },
  lint: {
    children: [`tsc`, `eslint`, `prettier`, `stylelint`, `cspell`, `knip`, `markdownlint`, `jscpd`],
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
    children: [`env:dev`, `build`, `deploy-run`],
    description: `Build (incl. build:server) + server:prod. No DB migrations. For PM2 or local prod.`,
    label: `🏃 Run`,
    mcp: false,
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

const mcpExcluded = (name: string): boolean => {
  const definition = defs[name];
  if (definition === undefined) {
    return true;
  }
  if (definition.mcp === false) {
    return true;
  }

  return `children` in definition ? definition.children.some(mcpExcluded) : false;
};

const listMcp = () => list().filter(({ name }) => !mcpExcluded(name));

export const Commands = { byName, list, listMcp, mcpExcluded };
