import { Config } from "@snappy/config";
import { Process } from "@snappy/node";

const containerUp = async (root: string) =>
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
  );

export const Db = { containerUp };
