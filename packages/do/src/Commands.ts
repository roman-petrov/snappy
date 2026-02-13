export type Command = { command: string; description: string; name: string };

const cmdRun = `run`;
const cmdDev = `dev`;
const cmdBuild = `build`;
const cmdTest = `npx vitest run`;
const cmdLintTsc = `npx tsc --noEmit`;
const cmdLintEslint = `npx eslint .`;
const cmdLintPrettier = `npx prettier --check .`;
const cmdLintStylelint = `npx stylelint --max-warnings=0 **/*.css`;
const cmdLintCspell = `npx cspell .`;
const cmdLintJscpd = `npx jscpd .`;
const cmdLintMarkdown = `npx markdownlint .`;
const cmdFixEslint = `npx eslint --fix .`;
const cmdFixPrettier = `npx prettier --write .`;
const cmdFixStylelint = `npx stylelint --fix --max-warnings=0 **/*.css`;
const cmdDbGenerate = `npx prisma generate`;
const cmdDbPush = `npx prisma db push`;
const cmdDbMigrateDev = `npx prisma migrate dev`;
const cmdDbMigrateDeploy = `npx prisma migrate deploy`;
const cmdDbMigrateReset = `npx prisma migrate reset`;
const cmdDbStudio = `npx prisma studio`;
const cmdDbSeed = `npx prisma db seed`;

const cmdCi = [
  cmdTest,
  cmdLintTsc,
  cmdLintEslint,
  cmdLintPrettier,
  cmdLintStylelint,
  cmdLintCspell,
  cmdLintJscpd,
  cmdLintMarkdown,
].join(` && `);

const commands = [
  { command: cmdRun, description: `Build and run server (server-prod → node dist/server.js).`, name: `run` },
  { command: cmdDev, description: `Run server in watch (server-dev).`, name: `dev` },
  { command: cmdBuild, description: `Build server into dist/server.js, static into dist/www.`, name: `build` },
  { command: cmdTest, description: `Run tests via vitest.`, name: `test` },
  {
    command: cmdCi,
    description: `Full CI pipeline: run tests and all linters (tsc, eslint, prettier, stylelint, cspell, jscpd, markdown).`,
    name: `ci`,
  },
  { command: cmdLintTsc, description: `TypeScript: type-check only (tsc --noEmit).`, name: `lint:tsc` },
  { command: cmdLintEslint, description: `ESLint: lint source code.`, name: `lint:eslint` },
  { command: cmdLintPrettier, description: `Prettier: check formatting (read-only).`, name: `lint:prettier` },
  { command: cmdLintStylelint, description: `Stylelint: lint CSS/SCSS.`, name: `lint:stylelint` },
  { command: cmdLintCspell, description: `CSpell: spell-check project files.`, name: `lint:cspell` },
  { command: cmdLintJscpd, description: `JSCPD: detect code duplication.`, name: `lint:jscpd` },
  { command: cmdLintMarkdown, description: `Markdownlint: lint markdown files.`, name: `lint:markdown` },
  { command: cmdFixEslint, description: `ESLint: auto-fix issues where possible.`, name: `fix:eslint` },
  { command: cmdFixPrettier, description: `Prettier: format and write files.`, name: `fix:prettier` },
  { command: cmdFixStylelint, description: `Stylelint: auto-fix CSS/SCSS.`, name: `fix:stylelint` },
  { command: cmdDbGenerate, description: `Database: generate Prisma client.`, name: `db:generate` },
  { command: cmdDbPush, description: `Database: push schema to database without migrations.`, name: `db:push` },
  { command: cmdDbMigrateDev, description: `Database: create and apply migration (dev).`, name: `db:migrate:dev` },
  {
    command: cmdDbMigrateDeploy,
    description: `Database: apply pending migrations (production).`,
    name: `db:migrate:deploy`,
  },
  {
    command: cmdDbMigrateReset,
    description: `Database: reset database and apply all migrations.`,
    name: `db:migrate:reset`,
  },
  { command: cmdDbStudio, description: `Database: open Prisma Studio GUI.`, name: `db:studio` },
  { command: cmdDbSeed, description: `Database: seed database with initial data.`, name: `db:seed` },
] as const;

const commandByName = (name: string) => commands.find(c => c.name === name);

export const Commands = { commandByName, commands };
