import { Config } from "@snappy/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  datasource: { shadowDatabaseUrl: Config.dbShadowUrl(), url: Config.dbUrl() },
  migrations: { path: `packages/db-core/prisma/migrations` },
  schema: `packages/db-core/prisma/schema.prisma`,
});
