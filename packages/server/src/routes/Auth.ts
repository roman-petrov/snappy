/* eslint-disable functional/no-expression-statements */
import type { Request, Response } from "express";

import { Jwt } from "../Jwt";
import { Password } from "../Password";
import { Storage } from "../Storage";
import type { AppContext } from "../Types";

const resetTokenExpiresHours = 1;
const passwordMinLength = 8;
const hasLetter = (s: string) => /[a-zA-Z]/.test(s);
const hasDigit = (s: string) => /[0-9]/.test(s);
const passwordValid = (s: string) => s.length >= passwordMinLength && hasLetter(s) && hasDigit(s);

const register = (ctx: AppContext) => async (req: Request, res: Response) => {
  if (ctx.jwtSecret === ``) {
    res.status(503).json({ error: `JWT_SECRET not configured` });

    return;
  }

  const { email, password } = (req.body as { email?: string; password?: string }) ?? {};

  if (typeof email !== `string` || email.trim() === `` || typeof password !== `string` || !passwordValid(password)) {
    res.status(400).json({ error: `Invalid email or password (min 8 chars, letters and digits)` });

    return;
  }

  const normalized = email.trim().toLowerCase();
  const existing = await ctx.db.user.findUnique({ where: { email: normalized } });

  if (existing !== null) {
    res.status(409).json({ error: `Email already registered` });

    return;
  }

  const passwordHash = await Password.hash(password);
  const user = await Storage.ensureUserByEmail(ctx.db, normalized, passwordHash);
  const token = Jwt.sign(user.id, ctx.jwtSecret);

  res.status(201).json({ token });
};

const login = (ctx: AppContext) => async (req: Request, res: Response) => {
  if (ctx.jwtSecret === ``) {
    res.status(503).json({ error: `JWT_SECRET not configured` });

    return;
  }

  const { email, password } = (req.body as { email?: string; password?: string }) ?? {};

  if (typeof email !== `string` || email.trim() === `` || typeof password !== `string` || password === ``) {
    res.status(400).json({ error: `Invalid email or password` });

    return;
  }

  const normalized = email.trim().toLowerCase();
  const user = await ctx.db.user.findUnique({ where: { email: normalized } });

  if (user === null || user.passwordHash === null) {
    res.status(401).json({ error: `Invalid credentials` });

    return;
  }

  const ok = await Password.verify(password, user.passwordHash);
  if (!ok) {
    res.status(401).json({ error: `Invalid credentials` });

    return;
  }

  const token = Jwt.sign(user.id, ctx.jwtSecret);

  res.json({ token });
};

const forgotPassword = (ctx: AppContext) => async (req: Request, res: Response) => {
  const { email } = (req.body as { email?: string }) ?? {};

  if (typeof email !== `string` || email.trim() === ``) {
    res.status(400).json({ error: `Email required` });

    return;
  }

  const normalized = email.trim().toLowerCase();
  const user = await ctx.db.user.findUnique({ where: { email: normalized } });

  if (user === null) {
    res.json({ ok: true });

    return;
  }

  const resetToken = crypto.randomUUID();
  const resetTokenExpires = new Date(Date.now() + resetTokenExpiresHours * 60 * 60 * 1000);
  await ctx.db.user.update({ data: { resetToken, resetTokenExpires }, where: { id: user.id } });

  res.json({ ok: true, resetToken });
};

const resetPassword = (ctx: AppContext) => async (req: Request, res: Response) => {
  const { token, newPassword } = (req.body as { token?: string; newPassword?: string }) ?? {};

  if (typeof token !== `string` || token === `` || typeof newPassword !== `string` || !passwordValid(newPassword)) {
    res.status(400).json({ error: `Token and new password (min 8 chars, letters and digits) required` });

    return;
  }

  const user = await ctx.db.user.findFirst({ where: { resetToken: token, resetTokenExpires: { gt: new Date() } } });

  if (user === null) {
    res.status(400).json({ error: `Invalid or expired token` });

    return;
  }

  const passwordHash = await Password.hash(newPassword);
  await ctx.db.user.update({
    data: { passwordHash, resetToken: null, resetTokenExpires: null },
    where: { id: user.id },
  });

  res.json({ ok: true });
};

export const Auth = { forgotPassword, login, register, resetPassword };
