import type { Command } from "../Command";

import { Vitest } from "../Vitest";

export const Shot: Command = {
  description: `Update test snapshots.`,
  label: `📸 Shot`,
  name: `shot`,
  run: Vitest.run(true),
};
