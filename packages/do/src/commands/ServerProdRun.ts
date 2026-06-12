import type { Command } from "../Command";

import { Run } from "../Run";

export const ServerProdRun: Command = {
  description: `Run API server in production.`,
  label: `🏭 Server run`,
  name: `server:prod:run`,
  run: Run.background({ command: `node dist/server/main.js`, cwd: `.`, shutdown: { command: `docker compose down` } }),
};
