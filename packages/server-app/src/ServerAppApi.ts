/* eslint-disable unicorn/no-null */
/* eslint-disable functional/no-expression-statements */
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

import { _, HttpStatus, Time } from "@snappy/core";
import { type FeatureType, Prompts } from "@snappy/snappy";

import type { ApiContext } from "./Context";

import { Jwt } from "./Jwt";
import { Password } from "./Password";
import { Storage } from "./Storage";

export const ServerAppApi = (context: ApiContext) => {
  const resetTokenExpiresHours = 1;
  const passwordMinLength = 8;
  const hasLetter = (s: string) => /[A-Za-z]/u.test(s);
  const hasDigit = (s: string) => /\d/u.test(s);
  const passwordValid = (s: string) => s.length >= passwordMinLength && hasLetter(s) && hasDigit(s);
  const normalizeEmail = (email: string) => email.trim().toLowerCase();
  const isFeatureType = (key: string): key is FeatureType => key in Prompts.systemPrompts;

  const jwtUnavailable = (): ApiRegisterResult | undefined =>
    context.jwtSecret === ``
      ? { error: `JWT_SECRET not configured`, status: HttpStatus.serviceUnavailable }
      : undefined;

  const register = async (body: ApiAuthBody): Promise<ApiRegisterResult> => {
    const unavailable = jwtUnavailable();
    if (unavailable !== undefined) {
      return unavailable;
    }

    const { email, password } = body;
    if (!_.isString(email) || email.trim() === `` || !_.isString(password) || !passwordValid(password)) {
      return { error: `Invalid email or password (min 8 chars, letters and digits)`, status: HttpStatus.badRequest };
    }

    const normalized = normalizeEmail(email);
    const existing = await context.db.user.findUnique({ where: { email: normalized } });
    if (existing !== null) {
      return { error: `Email already registered`, status: HttpStatus.conflict };
    }

    const hash = await Password.hash(password);
    const user = await Storage.ensureUserByEmail(context.db, normalized, hash);
    const token = Jwt.sign(user.id, context.jwtSecret);

    return { token };
  };

  const login = async (body: ApiAuthBody): Promise<ApiLoginResult> => {
    const unavailable = jwtUnavailable();
    if (unavailable !== undefined) {
      return unavailable;
    }

    const { email, password } = body;
    if (!_.isString(email) || email.trim() === `` || !_.isString(password) || password === ``) {
      return { error: `Invalid email or password`, status: HttpStatus.badRequest };
    }

    const normalized = normalizeEmail(email);
    const user = await context.db.user.findUnique({ where: { email: normalized } });
    if (user?.passwordHash === null || user === null) {
      return { error: `Invalid credentials`, status: HttpStatus.unauthorized };
    }

    const ok = await Password.verify(password, user.passwordHash);
    if (!ok) {
      return { error: `Invalid credentials`, status: HttpStatus.unauthorized };
    }

    const token = Jwt.sign(user.id, context.jwtSecret);

    return { token };
  };

  const forgotPassword = async (body: ApiForgotPasswordBody): Promise<ApiForgotPasswordResult> => {
    const { email } = body;
    if (!_.isString(email) || email.trim() === ``) {
      return { error: `Email required`, status: HttpStatus.badRequest };
    }

    const normalized = normalizeEmail(email);
    const user = await context.db.user.findUnique({ where: { email: normalized } });
    if (user === null) {
      return { ok: true };
    }

    const resetToken = crypto.randomUUID();
    const resetTokenExpires = new Date(Date.now() + resetTokenExpiresHours * Time.hourInMs);
    await context.db.user.update({ data: { resetToken, resetTokenExpires }, where: { id: user.id } });

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

    const user = await context.db.user.findFirst({
      where: { resetToken: token, resetTokenExpires: { gt: new Date() } },
    });
    if (user === null) {
      return { error: `Invalid or expired token`, status: HttpStatus.badRequest };
    }

    const hash = await Password.hash(newPassword);
    await context.db.user.update({
      data: { passwordHash: hash, resetToken: null, resetTokenExpires: null },
      where: { id: user.id },
    });

    return { ok: true };
  };

  const remaining = async (userId: number): Promise<number> =>
    Storage.remainingByUserId(context.db, userId, context.freeRequestLimit);

  const process = async (userId: number, body: { feature?: string; text?: string }): Promise<ApiProcessResultUnion> => {
    const { feature, text } = body;
    if (!_.isString(text) || text.trim() === `` || !_.isString(feature) || !isFeatureType(feature)) {
      return { error: `text and feature required; feature must be valid`, status: HttpStatus.badRequest };
    }

    const can = await Storage.canMakeRequestByUserId(context.db, userId, context.freeRequestLimit);
    if (!can) {
      return { error: `Request limit reached`, status: HttpStatus.tooManyRequests };
    }

    const result = await context.snappy
      .processText(text.trim(), feature)
      .then(async value => {
        await Storage.incrementRequestByUserId(context.db, userId);

        return { text: value } as ApiProcessResultUnion;
      })
      .catch(() => ({ error: `Processing failed`, status: HttpStatus.internalServerError }) as ApiProcessResultUnion);

    return result;
  };

  const paymentUrl = async (userId: number): Promise<ApiPaymentUrlResultUnion> =>
    context.yooKassa
      .paymentUrl(userId, context.premiumPrice, `Snappy Bot - Premium подписка (30 дней)`)
      .then(url => ({ url }))
      .catch(() => ({ error: `Payment error`, status: HttpStatus.internalServerError }));

  const verifyToken = (token: string): undefined | { userId: number } =>
    Jwt.verify(token, context.jwtSecret) ?? undefined;

  const ensureUserByTelegramId = async (telegramId: number, telegramUsername?: string) =>
    Storage.ensureUserByTelegramId(context.db, telegramId, telegramUsername);

  return {
    auth: { forgotPassword, login, register, resetPassword },
    ensureUserByTelegramId,
    jwt: { verify: verifyToken },
    premium: { paymentUrl },
    process,
    user: { remaining },
  };
};

export type ServerAppApi = ReturnType<typeof ServerAppApi>;
