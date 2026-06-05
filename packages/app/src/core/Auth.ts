import { _ } from "@snappy/core";
import { createAuthClient } from "better-auth/client";

const client = createAuthClient();

type ErrorResult = { error?: null | { code?: string } };

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
  if (normalized === `TOKEN_EXPIRED` || normalized === `INVALID_TOKEN`) {
    return `invalidOrExpiredToken`;
  }

  return `unknownError`;
};

const call = async <TResult extends ErrorResult>(run: () => Promise<TResult>) => {
  const result = await run();
  const errorCode = readErrorCode(result);

  return errorCode === undefined ? { status: `ok` } : { status: toCamelStatus(errorCode) };
};

const signIn = async (email: string, password: string) => call(async () => client.signIn.email({ email, password }));

const signUp = async (email: string, password: string) =>
  call(async () => client.signUp.email({ email, name: email, password }));

const signOut = async () => client.signOut();
const requestPasswordReset = async (email: string) => call(async () => client.requestPasswordReset({ email }));

const resetPassword = async (token: string, newPassword: string) =>
  call(async () => client.resetPassword({ newPassword, token }));

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

export const Auth = { changePassword, requestPasswordReset, resetPassword, signedIn, signIn, signOut, signUp, user };
