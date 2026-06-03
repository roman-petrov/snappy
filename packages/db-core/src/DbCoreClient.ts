import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "./generated/client";

export const DbCoreClient = (connectionString: string) =>
  new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
