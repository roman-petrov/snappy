/* eslint-disable functional/no-expression-statements */
import type { Request, Response } from "express";

import { Jwt } from "./Jwt";
import { Storage } from "./Storage";
import type { AppContext } from "./Types";

const bearerPrefix = `Bearer `;

const requireJwt = (ctx: AppContext) => (req: Request, res: Response, next: () => void) => {
  const auth = req.headers.authorization;
  const token = typeof auth === `string` && auth.startsWith(bearerPrefix) ? auth.slice(bearerPrefix.length) : undefined;

  if (token === undefined || ctx.jwtSecret === ``) {
    res.status(401).json({ error: `Unauthorized` });

    return;
  }

  const payload = Jwt.verify(token, ctx.jwtSecret);
  if (payload === undefined) {
    res.status(401).json({ error: `Invalid token` });

    return;
  }

  (req as Request & { userId: number })[`userId`] = payload.userId;
  next();
};

const requireBotKey = (botApiKey: string) => (req: Request, res: Response, next: () => void) => {
  const key = req.headers[`x-bot-api-key`];
  const received = typeof key === `string` ? key : ``;

  if (botApiKey === `` || received !== botApiKey) {
    res.status(401).json({ error: `Unauthorized` });

    return;
  }

  const body = req.body as { telegramId?: number };
  const telegramId =
    typeof body[`telegramId`] === `number`
      ? body[`telegramId`]
      : Number(typeof req.query[`telegramId`] === `string` ? req.query[`telegramId`] : NaN);

  if (Number.isNaN(telegramId)) {
    res.status(400).json({ error: `telegramId required` });

    return;
  }

  (req as Request & { telegramId: number })[`telegramId`] = telegramId;
  next();
};

const resolveUserIdFromBot = (ctx: AppContext) => async (req: Request, _res: Response, next: () => void) => {
  const telegramId = (req as Request & { telegramId?: number })[`telegramId`];

  if (telegramId === undefined) {
    next();

    return;
  }

  const user = await Storage.ensureUserByTelegramId(ctx.db, telegramId);
  (req as Request & { userId: number })[`userId`] = user.id;
  next();
};

const requireUser = (ctx: AppContext, botApiKey: string) => {
  return (req: Request, res: Response, next: () => void) => {
    const tryJwt = () => {
      const auth = req.headers.authorization;
      const token =
        typeof auth === `string` && auth.startsWith(bearerPrefix) ? auth.slice(bearerPrefix.length) : undefined;

      if (token === undefined || ctx.jwtSecret === ``) {
        return false;
      }

      const payload = Jwt.verify(token, ctx.jwtSecret);
      if (payload === undefined) {
        return false;
      }

      (req as Request & { userId: number })[`userId`] = payload.userId;

      return true;
    };

    const tryBot = () => {
      const key = req.headers[`x-bot-api-key`];
      const received = typeof key === `string` ? key : ``;
      if (botApiKey === `` || received !== botApiKey) {
        return false;
      }

      const body = req.body as { telegramId?: number };
      const telegramId =
        typeof body[`telegramId`] === `number`
          ? body[`telegramId`]
          : Number(typeof req.query[`telegramId`] === `string` ? req.query[`telegramId`] : NaN);
      if (Number.isNaN(telegramId)) {
        return false;
      }

      (req as Request & { telegramId: number })[`telegramId`] = telegramId;

      return true;
    };

    if (tryJwt()) {
      next();

      return;
    }

    if (!tryBot()) {
      res.status(401).json({ error: `Unauthorized` });

      return;
    }

    void (async () => {
      const telegramId = (req as Request & { telegramId: number })[`telegramId`];
      const user = await Storage.ensureUserByTelegramId(ctx.db, telegramId);
      (req as Request & { userId: number })[`userId`] = user.id;
      next();
    })();
  };
};

export const Middleware = { requireBotKey, requireJwt, requireUser, resolveUserIdFromBot };
