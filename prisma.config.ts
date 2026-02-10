import { Config } from "@snappy/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  datasource: { url: Config.dbUrl },
  migrations: { path: `packages/db/prisma/migrations`, seed: `bun run packages/db/src/seed.ts` },
  schema: `packages/db/prisma/schema.prisma`,
});
