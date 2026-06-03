import { prismaAdapter } from "better-auth/adapters/prisma";

import type { PrismaClient } from "./generated/client";

export const DbCoreAuthAdapter = (prisma: PrismaClient) => prismaAdapter(prisma, { provider: `postgresql` });
