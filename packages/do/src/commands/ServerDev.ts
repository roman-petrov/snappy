import type { Command } from "../Command";

export const ServerDev: Command = {
  children: [`server:frontend:dev`],
  description: `Run site, app, admin, and API in development.`,
  label: `🖥️ Server`,
  name: `server:dev`,
};
