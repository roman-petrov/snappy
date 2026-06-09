import { _ } from "@snappy/core";
import { createAuthClient } from "better-auth/client";

const client = createAuthClient();

export type AuthStatus = { retryAfterSec?: number; status: string };

type ErrorResult = { error?: null | { code?: string; retryAfter?: number } };

const readErrorCode = (result: ErrorResult) => {
  if (result.error === undefined || result.error === null) {
    return undefined;
  }
  const { code } = result.error;

  return _.isString(code) && code !== `` ? code : `UNKNOWN_ERROR`;
};

const toCamelStatus = (code: string) => {
  const normalized = code.trim().toUpperCase();
  if (normalized === `INVALID_EMAIL`) {
    return `invalidEmail`;
  }
  if (normalized === `INVALID_EMAIL_OR_PASSWORD` || normalized === `INVALID_PASSWORD`) {
    return `invalidCredentials`;
  }
  if (normalized === `USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL`) {
    return `emailAlreadyRegistered`;
  }
  if (normalized === `EMAIL_NOT_VERIFIED`) {
    return `emailNotVerified`;
  }
  if (normalized === `TOKEN_EXPIRED` || normalized === `INVALID_TOKEN`) {
    return `invalidOrExpiredToken`;
  }
  if (normalized === `TOO_MANY_REQUESTS`) {
    return `tooManyRequests`;
  }

  return `unknownError`;
};

const trimEmail = (email: string) => email.trim();

const call = async <TResult extends ErrorResult>(run: () => Promise<TResult>): Promise<AuthStatus> => {
  const result = await run();
  const errorCode = readErrorCode(result);

  if (errorCode === undefined) {
    return { status: `ok` };
  }

  const status = toCamelStatus(errorCode);
  const { retryAfter } = result.error ?? {};

  return status === `tooManyRequests`
    ? { retryAfterSec: _.isNumber(retryAfter) && retryAfter > 0 ? Math.ceil(retryAfter) : undefined, status }
    : { status };
};

const signIn = async (email: string, password: string) =>
  call(async () => client.signIn.email({ email: trimEmail(email), password }));

const signUp = async (email: string, password: string, callbackUrl: string) => {
  const trimmed = trimEmail(email);

  return call(async () => client.signUp.email({ callbackURL: callbackUrl, email: trimmed, name: trimmed, password }));
};

const signOut = async () => client.signOut();

const requestPasswordReset = async (email: string, redirectTo: string) =>
  call(async () => client.requestPasswordReset({ email: trimEmail(email), redirectTo }));

const resetPassword = async (token: string, newPassword: string) =>
  call(async () => client.resetPassword({ newPassword, token }));

const sendVerificationEmail = async (email: string, callbackUrl: string) =>
  call(async () => client.sendVerificationEmail({ callbackURL: callbackUrl, email: trimEmail(email) }));

const signedIn = async () => {
  const result = await client.getSession();
  const errorCode = readErrorCode(result);

  return errorCode === undefined ? result.data?.session !== undefined : false;
};

const user = async () => {
  const result = await client.getSession();
  const errorCode = readErrorCode(result);
  const email = result.data?.user.email;

  return errorCode === undefined && email !== undefined ? { email } : undefined;
};

const changePassword = async (currentPassword: string, newPassword: string) => {
  const result = await client.changePassword({ currentPassword, newPassword });
  const errorCode = readErrorCode(result);

  return errorCode === undefined
    ? { status: `ok` }
    : errorCode === `INVALID_PASSWORD`
      ? { status: `invalidCurrentPassword` }
      : { status: toCamelStatus(errorCode) };
};

export const Auth = {
  changePassword,
  requestPasswordReset,
  resetPassword,
  sendVerificationEmail,
  signedIn,
  signIn,
  signOut,
  signUp,
  user,
};
