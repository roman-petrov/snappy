/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-promise-reject */
/* eslint-disable @typescript-eslint/require-await */
import type { Db } from "@snappy/db";

import { Config } from "@snappy/config";
import { _, Email as EmailCore } from "@snappy/core";
import { Email } from "@snappy/email";
import { Settings } from "@snappy/ui-core";
import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";

import type { Balance } from "./Balance";

import { AppLog } from "./AppLog";
import { AuthEmail } from "./AuthEmail";

export type BetterAuthConfig = { balance: Balance; db: Db };

export const BetterAuth = ({ balance, db }: BetterAuthConfig) => {
  const resetEmail = AuthEmail();
  const verifyEmail = AuthEmail();

  const sendAuthEmail = async (kind: `reset` | `verify`, email: string, send: () => Promise<void>) =>
    send().catch((error: unknown) => {
      if (!(error instanceof APIError)) {
        AppLog({ email }).auth.error(`auth.email.failed`, { kind });
      }
      throw error;
    });

  return betterAuth({
    advanced: { cookiePrefix: `snappy` },
    basePath: `/api/auth`,
    baseURL: _.https(Config.host),
    database: db.auth,
    databaseHooks: {
      user: {
        create: {
          after: async user => {
            await balance.creditFromSignUp(db.user(user.id));
            AppLog({ email: user.email, userId: user.id }).auth.info(`auth.signup.bonus`, {
              amount: Config.balance.signUpBonus,
            });
          },
          before: async user => {
            if (EmailCore.foreignProvider(user.email)) {
              AppLog({ email: user.email }).auth.warn(`auth.signup.rejected`, { reason: `FOREIGN_EMAIL` });
              throw APIError.from(`BAD_REQUEST`, {
                code: `FOREIGN_EMAIL`,
                message: `Foreign email provider is not allowed for registration`,
              });
            }

            return { data: user };
          },
        },
      },
    },
    emailAndPassword: {
      autoSignIn: false,
      enabled: true,
      requireEmailVerification: true,
      sendResetPassword: async ({ url, user }, request) =>
        sendAuthEmail(`reset`, user.email, async () =>
          resetEmail.send(user.email, Email.forgotPassword({ locale: Settings(request).locale, url })),
        ),
    },
    emailVerification: {
      autoSignInAfterVerification: true,
      sendOnSignIn: true,
      sendVerificationEmail: async ({ url, user }, request) =>
        sendAuthEmail(`verify`, user.email, async () =>
          verifyEmail.send(user.email, Email.verifyEmail({ locale: Settings(request).locale, url })),
        ),
    },
    rateLimit: { enabled: true, max: 100, window: Config.authEmailCooldownSec },
    secret: Config.betterAuthJwtSecret(),
    trustedOrigins: [_.https(Config.host)],
  });
};

export type BetterAuth = ReturnType<typeof BetterAuth>;
