/* eslint-disable @typescript-eslint/require-await */
import type { Db } from "@snappy/db";

import { Config } from "@snappy/config";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

export type BetterAuthConfig = { prisma: Db[`prisma`] };

export const BetterAuth = ({ prisma }: BetterAuthConfig) =>
  betterAuth({
    basePath: `/api/auth`,
    baseURL: Config.origin,
    database: prismaAdapter(prisma, { provider: `postgresql` }),
    emailAndPassword: { enabled: true, sendResetPassword: async () => undefined },
    secret: Config.betterAuthJwtSecret,
    trustedOrigins: Config.betterAuthTrustedOrigins,
  });

export type BetterAuth = ReturnType<typeof BetterAuth>;
