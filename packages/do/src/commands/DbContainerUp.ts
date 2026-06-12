import { Config } from "@snappy/config";
import { Process } from "@snappy/node";

import type { Command } from "../Command";

export const DbContainerUp: Command = {
  description: `Start local database.`,
  label: `🐳 Database container`,
  mcp: false,
  name: `db:container:up`,
  run: async root =>
    Process.exitCode(
      await Process.spawnShell(root, `docker compose up -d`, {
        env: {
          DB_NAME: Config.dbName(),
          DB_PASSWORD: Config.dbPassword(),
          DB_PORT: Config.dbPort(),
          DB_USER: Config.dbUser(),
        },
        silent: true,
      }),
    ),
};
