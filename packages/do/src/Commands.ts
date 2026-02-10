export type Command = { command: string; description: string; name: string };

const cmdRun = `run`;
const cmdDev = `dev`;
const cmdBuild = `build`;
const cmdTest = `bun test`;
const cmdLintTsc = `bunx tsc --noEmit`;
const cmdLintEslint = `bunx eslint .`;
const cmdLintPrettier = `bunx prettier --check .`;
const cmdLintStylelint = `bunx stylelint --max-warnings=0 **/*.css`;
const cmdLintCspell = `bunx cspell .`;
const cmdLintJscpd = `bunx jscpd .`;
const cmdLintMarkdown = `bunx markdownlint .`;
const cmdFixEslint = `bunx eslint --fix .`;
const cmdFixPrettier = `bunx prettier --write .`;
const cmdFixStylelint = `bunx stylelint --fix --max-warnings=0 **/*.css`;

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
  { command: cmdTest, description: `Run tests via bun test.`, name: `test` },
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
] as const;

const commandByName = (name: string) => commands.find(c => c.name === name);

export const Commands = { commandByName, commands };
