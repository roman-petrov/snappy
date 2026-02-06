export type Command = { command: string; description: string; name: string };

const commands = [
  { command: `run`, description: `Build and run server (server-prod → node dist/server.js).`, name: `run` },
  { command: `dev`, description: `Run server in watch (server-dev).`, name: `dev` },
  { command: `build`, description: `Build server into dist/server.js, static into dist/www.`, name: `build` },
  { command: `bun test`, description: `Run tests via bun test.`, name: `test` },
  {
    command: `bun test && bunx tsc --noEmit && bunx eslint . && bunx prettier --check . && bunx cspell . && bunx jscpd . && bunx markdownlint .`,
    description: `Full CI pipeline: run tests and all linters (tsc, eslint, prettier, cspell, jscpd, markdown).`,
    name: `ci`,
  },
  { command: `bunx tsc --noEmit`, description: `TypeScript: type-check only (tsc --noEmit).`, name: `lint:tsc` },
  { command: `bunx eslint .`, description: `ESLint: lint source code.`, name: `lint:eslint` },
  { command: `bunx prettier --check .`, description: `Prettier: check formatting (read-only).`, name: `lint:prettier` },
  { command: `bunx cspell .`, description: `CSpell: spell-check project files.`, name: `lint:cspell` },
  { command: `bunx jscpd .`, description: `JSCPD: detect code duplication.`, name: `lint:jscpd` },
  { command: `bunx markdownlint .`, description: `Markdownlint: lint markdown files.`, name: `lint:markdown` },
  { command: `bunx eslint --fix .`, description: `ESLint: auto-fix issues where possible.`, name: `fix:eslint` },
  { command: `bunx prettier --write .`, description: `Prettier: format and write files.`, name: `fix:prettier` },
] as const;

const commandByName = (name: string) => commands.find(c => c.name === name);

export const Commands = { commandByName, commands };
