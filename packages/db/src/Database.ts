import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "./generated/client";

export const Database = (connectionString: string) => new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

export type Database = ReturnType<typeof Database>;
