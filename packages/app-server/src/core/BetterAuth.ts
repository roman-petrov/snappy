import type { DbAuth } from "@snappy/db";

import { Config } from "@snappy/config";
import { _ } from "@snappy/core";
import { Email } from "@snappy/email";
import { Settings } from "@snappy/ui-core";
import { betterAuth } from "better-auth";

import { AuthEmail } from "./AuthEmail";

export type BetterAuthConfig = { auth: DbAuth };

export const BetterAuth = ({ auth }: BetterAuthConfig) => {
  const resetEmail = AuthEmail();
  const verifyEmail = AuthEmail();
  const requestPasswordResetPath = `/request-password-reset`;
  const sendVerificationEmailPath = `/send-verification-email`;
  const signUpEmailPath = `/sign-up/email`;
  const emailSendRateLimit = { max: 1, window: Config.authEmailCooldownSec };
  const emailSendRateLimitPaths = [requestPasswordResetPath, sendVerificationEmailPath, signUpEmailPath] as const;

  return betterAuth({
    advanced: { cookiePrefix: `snappy` },
    basePath: `/api/auth`,
    baseURL: _.https(Config.host),
    database: auth,
    emailAndPassword: {
      autoSignIn: false,
      enabled: true,
      requireEmailVerification: true,
      sendResetPassword: async ({ url, user }, request) =>
        resetEmail.send(user.email, Email.forgotPassword({ locale: Settings(request).locale, url })),
    },
    emailVerification: {
      autoSignInAfterVerification: true,
      sendOnSignIn: true,
      sendVerificationEmail: async ({ url, user }, request) =>
        verifyEmail.send(user.email, Email.verifyEmail({ locale: Settings(request).locale, url })),
    },
    rateLimit: {
      customRules: _.fromEntries(emailSendRateLimitPaths.map(path => [path, emailSendRateLimit])),
      enabled: true,
      max: 100,
      window: Config.authEmailCooldownSec,
    },
    secret: Config.betterAuthJwtSecret(),
    trustedOrigins: [_.https(Config.host)],
  });
};

export type BetterAuth = ReturnType<typeof BetterAuth>;
