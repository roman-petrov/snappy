/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable unicorn/no-null */
import type { ApiAuthBody, ApiForgotPasswordBody, ApiResetPasswordBody } from "@snappy/server-api";
import type { Request, Response } from "express";

import { _, HttpStatus, Time } from "@snappy/core";

import type { AppContext } from "../Types";

import { Jwt } from "../Jwt";
import { Password } from "../Password";
import { Storage } from "../Storage";

const resetTokenExpiresHours = 1;
const passwordMinLength = 8;
const hasLetter = (s: string) => /[A-Za-z]/u.test(s);
const hasDigit = (s: string) => /\d/u.test(s);
const passwordValid = (s: string) => s.length >= passwordMinLength && hasLetter(s) && hasDigit(s);
const normalizeEmail = (email: string) => email.trim().toLowerCase();

const jwtUnavailable = (context: AppContext, response: Response): boolean => {
  if (context.jwtSecret !== ``) {return false;}
  response.status(HttpStatus.serviceUnavailable).json({ error: `JWT_SECRET not configured` });

  return true;
};

const register = (context: AppContext) => async (request: Request, response: Response) => {
  if (jwtUnavailable(context, response)) {return;}

  const { email, password } = (request.body as ApiAuthBody) ?? {};

  if (!_.isString(email) || email.trim() === `` || !_.isString(password) || !passwordValid(password)) {
    response
      .status(HttpStatus.badRequest)
      .json({ error: `Invalid email or password (min 8 chars, letters and digits)` });

    return;
  }

  const normalized = normalizeEmail(email);
  const existing = await context.db.user.findUnique({ where: { email: normalized } });

  if (existing !== null) {
    response.status(HttpStatus.conflict).json({ error: `Email already registered` });

    return;
  }

  const passwordHash = await Password.hash(password);
  const user = await Storage.ensureUserByEmail(context.db, normalized, passwordHash);
  const token = Jwt.sign(user.id, context.jwtSecret);

  response.status(HttpStatus.created).json({ token });
};

const login = (context: AppContext) => async (request: Request, response: Response) => {
  if (jwtUnavailable(context, response)) {return;}

  const { email, password } = (request.body as ApiAuthBody) ?? {};

  if (!_.isString(email) || email.trim() === `` || !_.isString(password) || password === ``) {
    response.status(HttpStatus.badRequest).json({ error: `Invalid email or password` });

    return;
  }

  const normalized = normalizeEmail(email);
  const user = await context.db.user.findUnique({ where: { email: normalized } });

  if (user?.passwordHash === null || user === null) {
    response.status(HttpStatus.unauthorized).json({ error: `Invalid credentials` });

    return;
  }

  const ok = await Password.verify(password, user.passwordHash);
  if (!ok) {
    response.status(HttpStatus.unauthorized).json({ error: `Invalid credentials` });

    return;
  }

  const token = Jwt.sign(user.id, context.jwtSecret);

  response.json({ token });
};

const forgotPassword = (context: AppContext) => async (request: Request, response: Response) => {
  const { email } = (request.body as ApiForgotPasswordBody) ?? {};

  if (!_.isString(email) || email.trim() === ``) {
    response.status(HttpStatus.badRequest).json({ error: `Email required` });

    return;
  }

  const normalized = normalizeEmail(email);
  const user = await context.db.user.findUnique({ where: { email: normalized } });

  if (user === null) {
    response.json({ ok: true });

    return;
  }

  const resetToken = crypto.randomUUID();
  const resetTokenExpires = new Date(Date.now() + resetTokenExpiresHours * Time.hourInMs);
  await context.db.user.update({ data: { resetToken, resetTokenExpires }, where: { id: user.id } });

  response.json({ ok: true, resetToken });
};

const resetPassword = (context: AppContext) => async (request: Request, response: Response) => {
  const { newPassword, token } = (request.body as ApiResetPasswordBody) ?? {};

  if (!_.isString(token) || token === `` || !_.isString(newPassword) || !passwordValid(newPassword)) {
    response
      .status(HttpStatus.badRequest)
      .json({ error: `Token and new password (min 8 chars, letters and digits) required` });

    return;
  }

  const user = await context.db.user.findFirst({ where: { resetToken: token, resetTokenExpires: { gt: new Date() } } });

  if (user === null) {
    response.status(HttpStatus.badRequest).json({ error: `Invalid or expired token` });

    return;
  }

  const passwordHash = await Password.hash(newPassword);
  await context.db.user.update({
    data: { passwordHash, resetToken: null, resetTokenExpires: null },
    where: { id: user.id },
  });

  response.json({ ok: true });
};

export const Auth = { forgotPassword, login, register, resetPassword };
