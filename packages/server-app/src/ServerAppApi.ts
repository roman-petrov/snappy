/* eslint-disable functional/no-try-statements */
/* eslint-disable unicorn/no-null */
/* eslint-disable functional/no-expression-statements */
import type { Database } from "@snappy/db";
import type {
  ApiAuthBody,
  ApiForgotPasswordBody,
  ApiForgotPasswordResult,
  ApiLoginResult,
  ApiPaymentUrlResultUnion,
  ApiProcessResultUnion,
  ApiRegisterResult,
  ApiResetPasswordBody,
  ApiResetPasswordResult,
} from "@snappy/server-api";
import type { YooKassa } from "@snappy/yoo-kassa";

import { _, Time } from "@snappy/core";
import { type FeatureType, Prompts, type Snappy } from "@snappy/snappy";

import { Jwt } from "./Jwt";
import { Password } from "./Password";

export type ServerAppApiContext = {
  db: Database;
  freeRequestLimit: number;
  jwtSecret: string;
  premiumPrice: number;
  snappy: Snappy;
  yooKassa: YooKassa;
};

export const ServerAppApi = ({
  db,
  freeRequestLimit,
  jwtSecret,
  premiumPrice,
  snappy,
  yooKassa,
}: ServerAppApiContext) => {
  const resetTokenExpiresHours = 1;
  const passwordMinLength = 8;
  const resetInterval = Time.dayInMs;
  const byUserId = (userId: number) => ({ where: { userId } }) as const;
  const resetData = () => ({ lastReset: new Date(), requestCount: 0 }) as const;
  const needsReset = (lastReset: Date) => Date.now() - lastReset.getTime() > resetInterval;
  const passwordValid = (s: string) => s.length >= passwordMinLength && /[A-Za-z]/u.test(s) && /\d/u.test(s);
  const normalizeEmail = (email: string) => email.trim().toLowerCase();
  const isFeatureType = (key: string): key is FeatureType => key in Prompts.systemPrompts;

  const ensureUserByTelegramId = async (telegramId: number, telegramUsername?: string) =>
    db.user.upsert({
      create: { telegramId, telegramUsername: telegramUsername ?? undefined },
      update: telegramUsername === undefined ? {} : { telegramUsername },
      where: { telegramId },
    });

  const remainingByUserId = async (userId: number): Promise<number> => {
    const settings = await db.snappySettings.findUnique(byUserId(userId));

    return settings === null
      ? freeRequestLimit
      : needsReset(settings.lastReset)
        ? freeRequestLimit
        : Math.max(0, freeRequestLimit - settings.requestCount);
  };

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
      const existing = await db.user.findUnique({ where: { email: normalized } });
      if (existing !== null) {
        return { status: `emailAlreadyRegistered` };
      }
      const hash = await Password.hash(password);
      const user = await db.user.create({ data: { email: normalized, passwordHash: hash } });

      return { token: signToken(user.id) };
    });

  const login = async (body: ApiAuthBody): Promise<ApiLoginResult> =>
    withJwtGuard(async () => {
      const { email, password } = body;
      if (!_.isString(email) || email.trim() === `` || !_.isString(password) || password === ``) {
        return { status: `emailInvalidOrMissing` };
      }
      const normalized = normalizeEmail(email);
      const user = await db.user.findUnique({ where: { email: normalized } });
      if (user?.passwordHash === null || user === null) {
        return { status: `invalidCredentials` };
      }
      const ok = await Password.verify(password, user.passwordHash);
      if (!ok) {
        return { status: `invalidCredentials` };
      }

      return { token: signToken(user.id) };
    });

  const forgotPassword = async (body: ApiForgotPasswordBody): Promise<ApiForgotPasswordResult> => {
    const { email } = body;
    if (!_.isString(email) || email.trim() === ``) {
      return { status: `emailRequired` };
    }

    const normalized = normalizeEmail(email);
    const user = await db.user.findUnique({ where: { email: normalized } });
    if (user === null) {
      return { status: `ok` };
    }

    const resetToken = crypto.randomUUID();
    const resetTokenExpires = new Date(Date.now() + resetTokenExpiresHours * Time.hourInMs);
    const { id } = user;
    await db.user.update({ data: { resetToken, resetTokenExpires }, where: { id } });

    return { resetToken, status: `ok` };
  };

  const resetPassword = async (body: ApiResetPasswordBody): Promise<ApiResetPasswordResult> => {
    const { newPassword, token } = body;
    if (!_.isString(token) || token === `` || !_.isString(newPassword) || !passwordValid(newPassword)) {
      return { status: `tokenAndPasswordRequired` };
    }

    const user = await db.user.findFirst({ where: { resetToken: token, resetTokenExpires: { gt: new Date() } } });
    if (user === null) {
      return { status: `invalidOrExpiredToken` };
    }

    const hash = await Password.hash(newPassword);
    const { id } = user;
    await db.user.update({ data: { passwordHash: hash, resetToken: null, resetTokenExpires: null }, where: { id } });

    return { status: `ok` };
  };

  const process = async (userId: number, body: { feature?: string; text?: string }): Promise<ApiProcessResultUnion> => {
    const { feature, text } = body;
    if (!_.isString(text) || text.trim() === `` || !_.isString(feature) || !isFeatureType(feature)) {
      return { status: `textAndFeatureRequired` };
    }

    const settings = await db.snappySettings.upsert({
      create: { ...resetData(), userId },
      update: {},
      ...byUserId(userId),
    });

    const reset = needsReset(settings.lastReset);
    if (reset) {
      await db.snappySettings.update({ data: resetData(), ...byUserId(userId) });
    }
    if (!reset && settings.requestCount >= freeRequestLimit) {
      return { status: `requestLimitReached` };
    }

    try {
      const value = await snappy.processText(text.trim(), feature);
      await db.snappySettings.upsert({
        create: { ...resetData(), requestCount: 1, userId },
        update: { requestCount: { increment: 1 } },
        ...byUserId(userId),
      });

      return { status: `ok`, text: value };
    } catch {
      return { status: `processingFailed` };
    }
  };

  const paymentUrl = async (userId: number): Promise<ApiPaymentUrlResultUnion> => {
    try {
      const url = await yooKassa.paymentUrl(userId, premiumPrice, `Snappy Bot - Premium подписка (30 дней)`);

      return { status: `ok`, url };
    } catch {
      return { status: `paymentError` };
    }
  };

  return {
    auth: { forgotPassword, login, register, resetPassword },
    ensureUserByTelegramId,
    jwt: { verify: (token: string) => Jwt.verify(token, jwtSecret) ?? undefined },
    premium: { paymentUrl },
    process,
    user: { remaining: remainingByUserId },
  };
};

export type ServerAppApi = ReturnType<typeof ServerAppApi>;
