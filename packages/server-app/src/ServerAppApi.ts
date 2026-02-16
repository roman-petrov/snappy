/* eslint-disable functional/no-try-statements */
/* eslint-disable unicorn/no-null */
/* eslint-disable functional/no-expression-statements */
import type { Database } from "@snappy/db";
import type {
  ApiAuthBody,
  ApiAuthSuccessInternal,
  ApiError,
  ApiForgotPasswordBody,
  ApiForgotPasswordResult,
  ApiPaymentUrlResultUnion,
  ApiProcessResultUnion,
  ApiResetPasswordBody,
  ApiResetPasswordResult,
} from "@snappy/server-api";
import type { YooKassa } from "@snappy/yoo-kassa";

import { _, HttpStatus, Time } from "@snappy/core";
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

  const jwtUnavailable = (): ApiError | undefined =>
    jwtSecret === `` ? { error: `JWT_SECRET not configured`, status: HttpStatus.serviceUnavailable } : undefined;

  const withJwtGuard = async <T>(fn: () => Promise<ApiError | T>): Promise<ApiError | T> => {
    const error = jwtUnavailable();
    if (error !== undefined) {
      return error;
    }

    return fn();
  };

  const signToken = (userId: number) => Jwt.sign(userId, jwtSecret);

  const register = async (body: ApiAuthBody): Promise<ApiAuthSuccessInternal | ApiError> =>
    withJwtGuard(async () => {
      const { email, password } = body;
      if (!_.isString(email) || email.trim() === `` || !_.isString(password) || !passwordValid(password)) {
        return { error: `Invalid email or password (min 8 chars, letters and digits)`, status: HttpStatus.badRequest };
      }
      const normalized = normalizeEmail(email);
      const existing = await db.user.findUnique({ where: { email: normalized } });
      if (existing !== null) {
        return { error: `Email already registered`, status: HttpStatus.conflict };
      }
      const hash = await Password.hash(password);
      const user = await db.user.create({ data: { email: normalized, passwordHash: hash } });

      return { token: signToken(user.id) };
    });

  const login = async (body: ApiAuthBody): Promise<ApiAuthSuccessInternal | ApiError> =>
    withJwtGuard(async () => {
      const { email, password } = body;
      if (!_.isString(email) || email.trim() === `` || !_.isString(password) || password === ``) {
        return { error: `Invalid email or password`, status: HttpStatus.badRequest };
      }
      const normalized = normalizeEmail(email);
      const user = await db.user.findUnique({ where: { email: normalized } });
      if (user?.passwordHash === null || user === null) {
        return { error: `Invalid credentials`, status: HttpStatus.unauthorized };
      }
      const ok = await Password.verify(password, user.passwordHash);
      if (!ok) {
        return { error: `Invalid credentials`, status: HttpStatus.unauthorized };
      }

      return { token: signToken(user.id) };
    });

  const forgotPassword = async (body: ApiForgotPasswordBody): Promise<ApiForgotPasswordResult> => {
    const { email } = body;
    if (!_.isString(email) || email.trim() === ``) {
      return { error: `Email required`, status: HttpStatus.badRequest };
    }

    const normalized = normalizeEmail(email);
    const user = await db.user.findUnique({ where: { email: normalized } });
    if (user === null) {
      return { ok: true };
    }

    const resetToken = crypto.randomUUID();
    const resetTokenExpires = new Date(Date.now() + resetTokenExpiresHours * Time.hourInMs);
    const { id } = user;
    await db.user.update({ data: { resetToken, resetTokenExpires }, where: { id } });

    return { ok: true, resetToken };
  };

  const resetPassword = async (body: ApiResetPasswordBody): Promise<ApiResetPasswordResult> => {
    const { newPassword, token } = body;
    if (!_.isString(token) || token === `` || !_.isString(newPassword) || !passwordValid(newPassword)) {
      return {
        error: `Token and new password (min 8 chars, letters and digits) required`,
        status: HttpStatus.badRequest,
      };
    }

    const user = await db.user.findFirst({ where: { resetToken: token, resetTokenExpires: { gt: new Date() } } });
    if (user === null) {
      return { error: `Invalid or expired token`, status: HttpStatus.badRequest };
    }

    const hash = await Password.hash(newPassword);
    const { id } = user;
    await db.user.update({ data: { passwordHash: hash, resetToken: null, resetTokenExpires: null }, where: { id } });

    return { ok: true };
  };

  const process = async (userId: number, body: { feature?: string; text?: string }): Promise<ApiProcessResultUnion> => {
    const { feature, text } = body;
    if (!_.isString(text) || text.trim() === `` || !_.isString(feature) || !isFeatureType(feature)) {
      return { error: `text and feature required; feature must be valid`, status: HttpStatus.badRequest };
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
      return { error: `Request limit reached`, status: HttpStatus.tooManyRequests };
    }

    try {
      const value = await snappy.processText(text.trim(), feature);
      await db.snappySettings.upsert({
        create: { ...resetData(), requestCount: 1, userId },
        update: { requestCount: { increment: 1 } },
        ...byUserId(userId),
      });

      return { text: value };
    } catch {
      return { error: `Processing failed`, status: HttpStatus.internalServerError };
    }
  };

  const paymentUrl = async (userId: number): Promise<ApiPaymentUrlResultUnion> => {
    try {
      const url = await yooKassa.paymentUrl(userId, premiumPrice, `Snappy Bot - Premium подписка (30 дней)`);

      return { url };
    } catch {
      return { error: `Payment error`, status: HttpStatus.internalServerError };
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
