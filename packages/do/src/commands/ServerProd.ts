import type { Command } from "../Command";

export const ServerProd: Command = {
  children: [`setup-s3`, `server:prod:run`],
  description: `Run API server in production.`,
  label: `🏭 Server`,
  name: `server:prod`,
};
