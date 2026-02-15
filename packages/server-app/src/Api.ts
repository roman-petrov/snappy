/* eslint-disable unicorn/no-null */
/* eslint-disable functional/no-expression-statements */
import type { ApiAuthBody, ApiForgotPasswordBody, ApiResetPasswordBody } from "@snappy/server-api";

import { _, HttpStatus, Time } from "@snappy/core";
import { type FeatureType, Prompts } from "@snappy/snappy";

import type { ApiContext } from "./Context";

import { Jwt } from "./Jwt";
import { Password } from "./Password";
import { Storage } from "./Storage";

const resetTokenExpiresHours = 1;
const passwordMinLength = 8;
const hasLetter = (s: string) => /[A-Za-z]/u.test(s);
const hasDigit = (s: string) => /\d/u.test(s);
const passwordValid = (s: string) => s.length >= passwordMinLength && hasLetter(s) && hasDigit(s);
const normalizeEmail = (email: string) => email.trim().toLowerCase();
const isFeatureType = (key: string): key is FeatureType => key in Prompts.systemPrompts;

export type AuthForgotResult = { error: string; status: number } | { ok: true; resetToken?: string };

export type AuthLoginResult = { error: string; status: number } | { token: string };

export type AuthRegisterResult = { error: string; status: number } | { token: string };

export type AuthResetResult = { error: string; status: number } | { ok: true };

export type PaymentUrlResult = { error: string; status: number } | { url: string };

export type ProcessResult = { error: string; status: number } | { text: string };

const authRegister = async (context: ApiContext, body: ApiAuthBody): Promise<AuthRegisterResult> => {
  if (context.jwtSecret === ``) {
    return { error: `JWT_SECRET not configured`, status: HttpStatus.serviceUnavailable };
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

  const passwordHash = await Password.hash(password);
  const user = await Storage.ensureUserByEmail(context.db, normalized, passwordHash);
  const token = Jwt.sign(user.id, context.jwtSecret);

  return { token };
};

const authLogin = async (context: ApiContext, body: ApiAuthBody): Promise<AuthLoginResult> => {
  if (context.jwtSecret === ``) {
    return { error: `JWT_SECRET not configured`, status: HttpStatus.serviceUnavailable };
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

const authForgotPassword = async (context: ApiContext, body: ApiForgotPasswordBody): Promise<AuthForgotResult> => {
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

const authResetPassword = async (context: ApiContext, body: ApiResetPasswordBody): Promise<AuthResetResult> => {
  const { newPassword, token } = body;
  if (!_.isString(token) || token === `` || !_.isString(newPassword) || !passwordValid(newPassword)) {
    return {
      error: `Token and new password (min 8 chars, letters and digits) required`,
      status: HttpStatus.badRequest,
    };
  }

  const user = await context.db.user.findFirst({ where: { resetToken: token, resetTokenExpires: { gt: new Date() } } });
  if (user === null) {
    return { error: `Invalid or expired token`, status: HttpStatus.badRequest };
  }

  const passwordHash = await Password.hash(newPassword);
  await context.db.user.update({
    data: { passwordHash, resetToken: null, resetTokenExpires: null },
    where: { id: user.id },
  });

  return { ok: true };
};

const userRemaining = async (context: ApiContext, userId: number): Promise<number> =>
  Storage.remainingByUserId(context.db, userId, context.freeRequestLimit);

const processText = async (
  context: ApiContext,
  userId: number,
  body: { feature?: string; text?: string },
): Promise<ProcessResult> => {
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

      return { text: value } as ProcessResult;
    })
    .catch(() => ({ error: `Processing failed`, status: HttpStatus.internalServerError }) as ProcessResult);

  return result;
};

const premiumPaymentUrl = async (context: ApiContext, userId: number): Promise<PaymentUrlResult> =>
  context.yooKassa
    .paymentUrl(userId, context.premiumPrice, `Snappy Bot - Premium подписка (30 дней)`)
    .then(url => ({ url }))
    .catch(() => ({ error: `Payment error`, status: HttpStatus.internalServerError }));

const jwtVerify = (context: ApiContext, token: string): undefined | { userId: number } =>
  Jwt.verify(token, context.jwtSecret) ?? undefined;

const ensureUserByTelegramId = async (context: ApiContext, telegramId: number, telegramUsername?: string) =>
  Storage.ensureUserByTelegramId(context.db, telegramId, telegramUsername);

export const createApi = (context: ApiContext) => ({
  auth: {
    forgotPassword: async (body: ApiForgotPasswordBody) => authForgotPassword(context, body),
    login: async (body: ApiAuthBody) => authLogin(context, body),
    register: async (body: ApiAuthBody) => authRegister(context, body),
    resetPassword: async (body: ApiResetPasswordBody) => authResetPassword(context, body),
  },
  ensureUserByTelegramId: async (telegramId: number, telegramUsername?: string) =>
    ensureUserByTelegramId(context, telegramId, telegramUsername),
  jwt: { verify: (token: string) => jwtVerify(context, token) },
  premium: { paymentUrl: async (userId: number) => premiumPaymentUrl(context, userId) },
  process: async (userId: number, body: { feature?: string; text?: string }) => processText(context, userId, body),
  user: { remaining: async (userId: number) => userRemaining(context, userId) },
});
