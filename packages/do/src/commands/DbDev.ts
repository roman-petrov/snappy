import type { Command } from "../Command";

export const DbDev: Command = {
  children: [`db:container:up`, `db:push:dev`],
  description: `Set up local database for development.`,
  label: `🗄️ Database`,
  mcp: false,
  name: `db:dev`,
};
