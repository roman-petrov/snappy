import type { Command } from "../Command";

import { Run } from "../Run";

export const Knip: Command = {
  description: `Check Knip issues.`,
  label: `🧹 Knip`,
  name: `knip`,
  run: Run.tool(`knip`, []),
};
