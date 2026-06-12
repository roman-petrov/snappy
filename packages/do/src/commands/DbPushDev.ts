import type { Command } from "../Command";

import { Run } from "../Run";

export const DbPushDev: Command = {
  description: `Sync local database schema for development.`,
  label: `⬇️ Schema sync`,
  mcp: false,
  name: `db:push:dev`,
  run: Run.tool(`prisma`, [`db`, `push`, `--accept-data-loss`]),
};
