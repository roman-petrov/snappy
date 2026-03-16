/* eslint-disable functional/no-expression-statements */
import type { Db } from "@snappy/db";
import type {
  ApiAuthBody,
  ApiForgotPasswordBody,
  ApiForgotPasswordResult,
  ApiLoginResult,
  ApiRegisterResult,
  ApiResetPasswordBody,
  ApiResetPasswordResult,
} from "@snappy/server-api";

import { _ } from "@snappy/core";

import { Jwt } from "./Jwt";
import { Password } from "./Password";

const passwordMinLength = 8;
const resetTokenExpiresHours = 1;
const passwordValid = (s: string) => s.length >= passwordMinLength && /[A-Za-z]/u.test(s) && /\d/u.test(s);
const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const Auth = ({ jwtSecret, user }: { jwtSecret: string; user: Db[`user`] }) => {
  const jwtUnavailable = (): undefined | { status: `jwtUnavailable` } =>
    jwtSecret === `` ? { status: `jwtUnavailable` } : undefined;

  const withJwtGuard = async <R>(fn: () => Promise<R>): Promise<R | { status: `jwtUnavailable` }> => {
    const error = jwtUnavailable();

    return error ?? fn();
  };

  const signToken = (userId: number) => Jwt.sign(userId, jwtSecret);

  const register = async (body: ApiAuthBody): Promise<ApiRegisterResult> =>
    withJwtGuard(async () => {
      const { email, password } = body;
      if (!_.isString(email) || email.trim() === `` || !_.isString(password)) {
        return { status: `emailInvalidOrMissing` };
      }
      if (!passwordValid(password)) {
        return { status: `passwordInvalid` };
      }
      const normalized = normalizeEmail(email);
      const existing = await user.findByEmail(normalized);
      if (existing !== undefined) {
        return { status: `emailAlreadyRegistered` };
      }
      const hash = await Password.hash(password);
      const row = await user.createWithEmailPassword(normalized, hash);

      return { token: signToken(row.id) };
    });

  const login = async (body: ApiAuthBody): Promise<ApiLoginResult> =>
    withJwtGuard(async () => {
      const { email, password } = body;
      if (!_.isString(email) || email.trim() === `` || !_.isString(password) || password === ``) {
        return { status: `emailInvalidOrMissing` };
      }
      const normalized = normalizeEmail(email);
      const row = await user.findByEmail(normalized);
      if (row?.passwordHash === undefined) {
        return { status: `invalidCredentials` };
      }
      const ok = await Password.verify(password, row.passwordHash);
      if (!ok) {
        return { status: `invalidCredentials` };
      }

      return { token: signToken(row.id) };
    });

  const forgotPassword = async (body: ApiForgotPasswordBody): Promise<ApiForgotPasswordResult> => {
    const { email } = body;
    if (!_.isString(email) || email.trim() === ``) {
      return { status: `emailRequired` };
    }

    const normalized = normalizeEmail(email);
    const row = await user.findByEmail(normalized);
    if (row === undefined) {
      return { status: `ok` };
    }

    const resetToken = crypto.randomUUID();
    const resetTokenExpires = _.now() + resetTokenExpiresHours * _.hour;
    await user.setResetToken(row.id, resetToken, resetTokenExpires);

    return { resetToken, status: `ok` };
  };

  const resetPassword = async (body: ApiResetPasswordBody): Promise<ApiResetPasswordResult> => {
    const { newPassword, token } = body;
    if (!_.isString(token) || token === `` || !_.isString(newPassword) || !passwordValid(newPassword)) {
      return { status: `tokenAndPasswordRequired` };
    }

    const row = await user.findByResetToken(token, _.now());
    if (row === undefined) {
      return { status: `invalidOrExpiredToken` };
    }

    const hash = await Password.hash(newPassword);
    await user.clearResetAndSetPassword(row.id, hash);

    return { status: `ok` };
  };

  const verify = (token: string) => Jwt.verify(token, jwtSecret) ?? undefined;

  return { forgotPassword, login, register, resetPassword, signToken, verify };
};

export type Auth = ReturnType<typeof Auth>;
