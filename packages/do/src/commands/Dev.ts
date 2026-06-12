import type { Command } from "../Command";

export const Dev: Command = {
  children: [`env:dev`, `server:dev`],
  description: `Set up development environment and run servers.`,
  label: `🚀 Dev server`,
  mcp: false,
  name: `dev`,
};
