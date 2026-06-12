import type { Command } from "../Command";

export const EnvDev: Command = {
  children: [`docker:start`, `db:dev`],
  description: `Set up Docker and local database for development.`,
  label: `🧰 Dev env`,
  mcp: false,
  name: `env:dev`,
};
