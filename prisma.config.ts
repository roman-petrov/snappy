import { Config } from "@snappy/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  datasource: { url: Config.dbUrl },
  migrations: { path: `packages/db/prisma/migrations`, seed: `node --import tsx/esm packages/db/src/seed.ts` },
  schema: `packages/db/prisma/schema.prisma`,
});
