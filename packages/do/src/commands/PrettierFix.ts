import type { Command } from "../Command";

import { Run } from "../Run";

export const PrettierFix: Command = {
  description: `Fix Prettier issues.`,
  label: `✨ Prettier`,
  name: `prettier-fix`,
  run: Run.tool(`prettier`, [`--write`, `.`]),
};
