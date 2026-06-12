import type { Command } from "../Command";

export const Lint: Command = {
  children: [`tsc`, `eslint`, `prettier`, `java-format`, `stylelint`, `cspell`, `knip`, `markdownlint`, `jscpd`],
  description: `Check all.`,
  label: `🛡️ Lint`,
  name: `lint`,
};
