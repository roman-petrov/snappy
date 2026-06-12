import { _ } from "@snappy/core";

import { Build } from "./Build";
import { Db } from "./Db";
import { DevCert } from "./DevCert";
import { Feature } from "./Feature";
import { type CommandDefinition, Run } from "./Run";
import { SecretsCmd } from "./SecretsCmd";
import { SetupS3 } from "./SetupS3";

const tsxPreload = `--import tsx/esm --require tsx/cjs`;

const defs = {
  [`build:admin`]: { description: `Build admin for production.`, label: `🛡️ Admin`, run: Run.withCapture(Build.admin) },
  [`build:app-android-debug`]: {
    description: `Build debug Android app for local testing.`,
    label: `🤖 Android debug`,
    run: Run.withCapture(Build.appAndroidDebug),
  },
  [`build:app-android`]: {
    description: `Build Android app for production.`,
    label: `🤖 Android app`,
    run: Run.withCapture(Build.appAndroid),
  },
  [`build:app`]: { description: `Build app for production.`, label: `💻 App`, run: Run.withCapture(Build.app) },
  [`build:server`]: {
    description: `Build API server for production.`,
    label: `🏭 Server`,
    run: Run.withCapture(Build.server),
  },
  [`build:site`]: { description: `Build site for production.`, label: `🌐 Site`, run: Run.withCapture(Build.site) },
  [`build:ssr`]: { description: `Build site SSR for production.`, label: `⚡ SSR`, run: Run.withCapture(Build.ssr) },
  [`db:container:up`]: {
    description: `Start local database.`,
    label: `🐳 Database container`,
    mcp: false,
    run: Db.containerUp,
  },
  [`db:dev`]: {
    children: [`db:container:up`, `db:push:dev`],
    description: `Set up local database for development.`,
    label: `🗄️ Database`,
    mcp: false,
  },
  [`db:migrate:deploy`]: {
    description: `Run database migrations on server.`,
    label: `📥 Apply migrations`,
    mcp: false,
    run: Run.tool(`prisma`, [`migrate`, `deploy`]),
  },
  [`db:push:dev`]: {
    description: `Sync local database schema for development.`,
    label: `⬇️ Schema sync`,
    mcp: false,
    run: Run.tool(`prisma`, [`db`, `push`, `--accept-data-loss`]),
  },
  [`docker:start`]: {
    description: `Start Docker for development.`,
    label: `🐳 Docker`,
    run: Run.shell(`docker desktop start`),
  },
  [`env:dev`]: {
    children: [`docker:start`, `db:dev`],
    description: `Set up Docker and local database for development.`,
    label: `🧰 Dev env`,
    mcp: false,
  },
  [`eslint-fix`]: {
    description: `Fix ESLint issues.`,
    label: `🔧 ESLint`,
    run: Run.tool(`eslint`, [`--fix`, `--max-warnings=0`, `.`]),
  },
  [`finish-feature`]: {
    description: `Prepare feature branch to merge into main.`,
    interactive: true,
    label: `🏁 Finish feature`,
    run: Feature.finish,
  },
  [`java-format-fix`]: {
    description: `Fix Java format issues.`,
    label: `☕ Java format fix`,
    run: Run.withCapture(Build.javaFormatFix),
  },
  [`java-format`]: {
    description: `Check Java format issues.`,
    label: `☕ Java format`,
    run: Run.withCapture(Build.javaFormat),
  },
  [`prettier-fix`]: {
    description: `Fix Prettier issues.`,
    label: `✨ Prettier`,
    run: Run.tool(`prettier`, [`--write`, `.`]),
  },
  [`server:dev`]: {
    children: [`setup-s3`, `server:frontend:dev`],
    description: `Run site, app, admin, and API in development.`,
    label: `🖥️ Server`,
  },
  [`server:frontend:dev`]: {
    description: `Run site, app, and admin in development.`,
    label: `🌐 Site + App + Admin`,
    run: Run.background({ background: true, command: `node ${tsxPreload} packages/do-dev/src/main.ts`, cwd: `.` }),
  },
  [`server:prod:run`]: {
    description: `Run API server in production.`,
    label: `🏭 Server run`,
    run: Run.background({
      command: `node dist/server/main.js`,
      cwd: `.`,
      shutdown: { command: `docker compose down` },
    }),
  },
  [`server:prod`]: {
    children: [`setup-s3`, `server:prod:run`],
    description: `Run API server in production.`,
    label: `🏭 Server`,
  },
  [`setup-s3`]: { description: `Apply S3 bucket policy and CORS.`, label: `📦 S3`, mcp: false, run: SetupS3.setup },
  [`stylelint-fix`]: {
    description: `Fix Stylelint issues.`,
    label: `🎨 Stylelint`,
    run: Run.tool(`stylelint`, [`--fix`, `--max-warnings=0`, `**/*.scss`]),
  },
  build: {
    children: [`build:site`, `build:ssr`, `build:app`, `build:admin`, `build:server`, `build:app-android`],
    description: `Build site, SSR, app, admin, API server, and Android app for production.`,
    label: `📦 Build`,
  },
  cert: { description: `Set up HTTPS for local development.`, label: `🔐 Dev TLS`, mcp: false, run: DevCert.setup },
  ci: {
    children: [`test`, `lint`, `build`],
    description: `Run tests, check, and build for production.`,
    label: `🔁 CI`,
  },
  cspell: { description: `Check CSpell issues.`, label: `📝 CSpell`, run: Run.tool(`cspell`, [`.`]) },
  decrypt: {
    description: `Decrypt secrets.prod.enc.yaml to secrets.prod.yaml.`,
    interactive: true,
    label: `📤 Decrypt prod secrets`,
    run: SecretsCmd.decrypt,
  },
  dev: {
    children: [`env:dev`, `server:dev`],
    description: `Set up development environment and run servers.`,
    label: `🚀 Dev server`,
    mcp: false,
  },
  encrypt: {
    description: `Generate key and encrypt secrets.prod.yaml to secrets.prod.enc.yaml.`,
    interactive: true,
    label: `🔒 Encrypt prod secrets`,
    run: SecretsCmd.encrypt,
  },
  eslint: {
    description: `Check ESLint issues.`,
    label: `🔍 ESLint`,
    run: Run.tool(`eslint`, [`--max-warnings=0`, `.`]),
  },
  jscpd: { description: `Check JSCPD issues.`, label: `📋 JSCPD`, run: Run.tool(`jscpd`, []) },
  knip: { description: `Check Knip issues.`, label: `🧹 Knip`, run: Run.tool(`knip`, []) },
  lint: {
    children: [`tsc`, `eslint`, `prettier`, `java-format`, `stylelint`, `cspell`, `knip`, `markdownlint`, `jscpd`],
    description: `Check all.`,
    label: `🛡️ Lint`,
  },
  markdownlint: {
    description: `Check Markdownlint issues.`,
    label: `📄 Markdown`,
    run: Run.tool(`markdownlint`, [`.`]),
  },
  prettier: {
    description: `Check Prettier issues.`,
    label: `✨ Prettier`,
    run: Run.tool(`prettier`, [`--check`, `.`]),
  },
  run: {
    children: [`env:dev`, `build`, `server:prod`],
    description: `Build for production and run locally.`,
    label: `🏃 Run`,
    mcp: false,
  },
  shot: { description: `Update test snapshots.`, label: `📸 Shot`, run: Run.tool(`vitest`, [`run`, `--update`]) },
  stylelint: {
    description: `Check Stylelint issues.`,
    label: `🎨 Stylelint`,
    run: Run.tool(`stylelint`, [`--max-warnings=0`, `**/*.scss`]),
  },
  test: { description: `Run tests.`, label: `🧪 Test`, run: Run.tool(`vitest`, [`run`]) },
  tsc: { description: `Check TypeScript issues.`, label: `📘 TypeScript`, run: Run.tool(`tsc`, [`--noEmit`]) },
} satisfies Record<string, CommandDefinition>;

export type CommandName = keyof typeof defs;

const has = (name: string): name is CommandName => Object.hasOwn(defs, name);
const byName = (name: CommandName): CommandDefinition => defs[name];

const list = (): { description: string; name: CommandName }[] =>
  _.keys(defs)
    .filter(has)
    .map(name => ({ description: defs[name].description, name }));

export const Commands = { byName, has, list };
