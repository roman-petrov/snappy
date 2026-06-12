import type { Command } from "../Command";

import { Run } from "../Run";

export const Shot: Command = {
  description: `Update test snapshots.`,
  label: `📸 Shot`,
  name: `shot`,
  run: Run.tool(`vitest`, [`run`, `--update`]),
};
