import type { Command } from "../Command";

export const RunCommand: Command = {
  children: [`env:dev`, `build`, `server:prod`],
  description: `Build for production and run locally.`,
  label: `🏃 Run`,
  mcp: false,
  name: `run`,
};
