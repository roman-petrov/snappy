import type { Command } from "../Command";

import { Run } from "../Run";

export const ServerFrontendDev: Command = {
  description: `Run site, app, and admin in development.`,
  label: `🌐 Site + App + Admin`,
  name: `server:frontend:dev`,
  run: Run.background({
    background: true,
    command: `node --import tsx/esm --require tsx/cjs packages/do-dev/src/main.ts`,
    cwd: `.`,
  }),
};
