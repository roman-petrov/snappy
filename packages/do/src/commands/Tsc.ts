import type { Command } from "../Command";

import { Run } from "../Run";

export const Tsc: Command = {
  description: `Check TypeScript issues.`,
  label: `📘 TypeScript`,
  name: `tsc`,
  run: Run.tool(`tsc`, [`--noEmit`]),
};
