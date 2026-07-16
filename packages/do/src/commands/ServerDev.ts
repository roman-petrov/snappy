import type { Command } from "../Command";

export const ServerDev: Command = {
  children: [`email:preview`, `server:frontend:dev`],
  description: `Run site, app, admin, API, and email preview in development.`,
  label: `🖥️ Server`,
  name: `server:dev`,
};
