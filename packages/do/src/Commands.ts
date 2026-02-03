export type Command = { command: string; description: string; name: string };

export const COMMANDS: readonly Command[] = [
  {
    name: "ci",
    description: "Full CI pipeline: run tests and all linters (tsc, eslint, prettier, cspell, jscpd, markdown).",
    command: "bun test && tsc --noEmit && eslint . && prettier --check . && cspell . && jscpd . && markdownlint .",
  },
  { name: "lint:tsc", description: "TypeScript: type-check only (tsc --noEmit).", command: "tsc --noEmit" },
  { name: "lint:eslint", description: "ESLint: lint source code.", command: "eslint ." },
  { name: "lint:prettier", description: "Prettier: check formatting (read-only).", command: "prettier --check ." },
  { name: "lint:cspell", description: "CSpell: spell-check project files.", command: "cspell ." },
  { name: "lint:jscpd", description: "JSCPD: detect code duplication.", command: "jscpd ." },
  { name: "lint:markdown", description: "Markdownlint: lint markdown files.", command: "markdownlint ." },
  { name: "fix:eslint", description: "ESLint: auto-fix issues where possible.", command: "eslint --fix ." },
  { name: "fix:prettier", description: "Prettier: format and write files.", command: "prettier --write ." },
] as const;

const commands = (): readonly Command[] => COMMANDS;
const commandByName = (name: string): Command | undefined => COMMANDS.find(c => c.name === name);

export const Commands = { commandByName, commands };
