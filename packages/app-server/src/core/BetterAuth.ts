/* eslint-disable @typescript-eslint/require-await */
import type { DbAuth } from "@snappy/db";

import { Config } from "@snappy/config";
import { _ } from "@snappy/core";
import { betterAuth } from "better-auth";

export type BetterAuthConfig = { auth: DbAuth };

export const BetterAuth = ({ auth }: BetterAuthConfig) =>
  betterAuth({
    advanced: { cookiePrefix: `snappy` },
    basePath: `/api/auth`,
    baseURL: _.https(Config.host),
    database: auth,
    emailAndPassword: { enabled: true, sendResetPassword: async () => undefined },
    secret: Config.betterAuthJwtSecret,
    trustedOrigins: [_.https(Config.host)],
  });

export type BetterAuth = ReturnType<typeof BetterAuth>;
