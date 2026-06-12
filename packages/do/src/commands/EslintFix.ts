import type { Command } from "../Command";

import { Run } from "../Run";

export const EslintFix: Command = {
  description: `Fix ESLint issues.`,
  label: `🔧 ESLint`,
  name: `eslint-fix`,
  run: Run.tool(`eslint`, [`--fix`, `--max-warnings=0`, `.`]),
};
