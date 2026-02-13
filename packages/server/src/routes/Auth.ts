/* eslint-disable functional/no-expression-statements */
import type { ApiAuthBody, ApiForgotPasswordBody, ApiResetPasswordBody } from "@snappy/server-api";
import type { Request, Response } from "express";

import type { AppContext } from "../Types";

import { Jwt } from "../Jwt";
import { Password } from "../Password";
import { Storage } from "../Storage";

const resetTokenExpiresHours = 1;
const passwordMinLength = 8;
const hasLetter = (s: string) => /[A-Za-z]/u.test(s);
const hasDigit = (s: string) => /\d/u.test(s);
const passwordValid = (s: string) => s.length >= passwordMinLength && hasLetter(s) && hasDigit(s);

const register = (context: AppContext) => async (request: Request, res: Response) => {
  if (context.jwtSecret === ``) {
    res.status(503).json({ error: `JWT_SECRET not configured` });

    return;
  }

  const { email, password } = (request.body as ApiAuthBody) ?? {};

  if (typeof email !== `string` || email.trim() === `` || typeof password !== `string` || !passwordValid(password)) {
    res.status(400).json({ error: `Invalid email or password (min 8 chars, letters and digits)` });

    return;
  }

  const normalized = email.trim().toLowerCase();
  const existing = await context.db.user.findUnique({ where: { email: normalized } });

  if (existing !== null) {
    res.status(409).json({ error: `Email already registered` });

    return;
  }

  const passwordHash = await Password.hash(password);
  const user = await Storage.ensureUserByEmail(context.db, normalized, passwordHash);
  const token = Jwt.sign(user.id, context.jwtSecret);

  res.status(201).json({ token });
};

const login = (context: AppContext) => async (request: Request, res: Response) => {
  if (context.jwtSecret === ``) {
    res.status(503).json({ error: `JWT_SECRET not configured` });

    return;
  }

  const { email, password } = (request.body as ApiAuthBody) ?? {};

  if (typeof email !== `string` || email.trim() === `` || typeof password !== `string` || password === ``) {
    res.status(400).json({ error: `Invalid email or password` });

    return;
  }

  const normalized = email.trim().toLowerCase();
  const user = await context.db.user.findUnique({ where: { email: normalized } });

  if (user === null || user.passwordHash === null) {
    res.status(401).json({ error: `Invalid credentials` });

    return;
  }

  const ok = await Password.verify(password, user.passwordHash);
  if (!ok) {
    res.status(401).json({ error: `Invalid credentials` });

    return;
  }

  const token = Jwt.sign(user.id, context.jwtSecret);

  res.json({ token });
};

const forgotPassword = (context: AppContext) => async (request: Request, res: Response) => {
  const { email } = (request.body as ApiForgotPasswordBody) ?? {};

  if (typeof email !== `string` || email.trim() === ``) {
    res.status(400).json({ error: `Email required` });

    return;
  }

  const normalized = email.trim().toLowerCase();
  const user = await context.db.user.findUnique({ where: { email: normalized } });

  if (user === null) {
    res.json({ ok: true });

    return;
  }

  const resetToken = crypto.randomUUID();
  const resetTokenExpires = new Date(Date.now() + resetTokenExpiresHours * 60 * 60 * 1000);
  await context.db.user.update({ data: { resetToken, resetTokenExpires }, where: { id: user.id } });

  res.json({ ok: true, resetToken });
};

const resetPassword = (context: AppContext) => async (request: Request, res: Response) => {
  const { newPassword, token } = (request.body as ApiResetPasswordBody) ?? {};

  if (typeof token !== `string` || token === `` || typeof newPassword !== `string` || !passwordValid(newPassword)) {
    res.status(400).json({ error: `Token and new password (min 8 chars, letters and digits) required` });

    return;
  }

  const user = await context.db.user.findFirst({ where: { resetToken: token, resetTokenExpires: { gt: new Date() } } });

  if (user === null) {
    res.status(400).json({ error: `Invalid or expired token` });

    return;
  }

  const passwordHash = await Password.hash(newPassword);
  await context.db.user.update({
    data: { passwordHash, resetToken: null, resetTokenExpires: null },
    where: { id: user.id },
  });

  res.json({ ok: true });
};

export const Auth = { forgotPassword, login, register, resetPassword };
