import { Config } from "@snappy/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  datasource: { url: Config.dbUrl },
  migrations: { path: `packages/db/prisma/migrations` },
  schema: `packages/db/prisma/schema.prisma`,
});
