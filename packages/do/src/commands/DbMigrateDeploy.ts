import type { Command } from "../Command";

import { Run } from "../Run";

export const DbMigrateDeploy: Command = {
  description: `Run database migrations on server.`,
  label: `📥 Apply migrations`,
  mcp: false,
  name: `db:migrate:deploy`,
  run: Run.tool(`prisma`, [`migrate`, `deploy`]),
};
