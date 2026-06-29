import type { Command } from "../Command";

import { Run } from "../Run";

export const Eslint: Command = {
  description: `Check ESLint issues.`,
  label: `🔍 ESLint`,
  name: `eslint`,
  run: Run.tool(`eslint`, [`--concurrency`, `auto`, `--max-warnings=0`, `.`]),
};
