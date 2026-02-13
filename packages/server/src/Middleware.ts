/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
import type { ApiBotBody } from "@snappy/server-api";
import type { Request, Response } from "express";

import { HttpStatus } from "@snappy/core";

import type { AppContext } from "./Types";

import { Jwt } from "./Jwt";
import { Storage } from "./Storage";

const bearerPrefix = `Bearer `;

const requireJwt = (context: AppContext) => (request: Request, response: Response, next: () => void) => {
  const auth = request.headers.authorization;
  const token = typeof auth === `string` && auth.startsWith(bearerPrefix) ? auth.slice(bearerPrefix.length) : undefined;

  if (token === undefined || context.jwtSecret === ``) {
    response.status(HttpStatus.unauthorized).json({ error: `Unauthorized` });

    return;
  }

  const payload = Jwt.verify(token, context.jwtSecret);
  if (payload === undefined) {
    response.status(HttpStatus.unauthorized).json({ error: `Invalid token` });

    return;
  }

  (request as Request & { userId: number }).userId = payload.userId;
  next();
};

const requireBotKey = (botApiKey: string) => (request: Request, response: Response, next: () => void) => {
  const key = request.headers[`x-bot-api-key`];
  const received = typeof key === `string` ? key : ``;

  if (botApiKey === `` || received !== botApiKey) {
    response.status(HttpStatus.unauthorized).json({ error: `Unauthorized` });

    return;
  }

  const body = request.body as ApiBotBody;

  const telegramId =
    typeof body.telegramId === `number`
      ? body.telegramId
      : Number(typeof request.query[`telegramId`] === `string` ? request.query[`telegramId`] : Number.NaN);

  if (Number.isNaN(telegramId)) {
    response.status(HttpStatus.badRequest).json({ error: `telegramId required` });

    return;
  }

  (request as Request & { telegramId: number }).telegramId = telegramId;
  next();
};

const resolveUserIdFromBot =
  (context: AppContext) => async (request: Request, _response: Response, next: () => void) => {
    const { telegramId } = request as Request & { telegramId?: number };

    if (telegramId === undefined) {
      next();

      return;
    }

    const user = await Storage.ensureUserByTelegramId(context.db, telegramId);
    (request as Request & { userId: number }).userId = user.id;
    next();
  };

const requireUser =
  (context: AppContext, botApiKey: string) => (request: Request, response: Response, next: () => void) => {
    const tryJwt = () => {
      const auth = request.headers.authorization;

      const token =
        typeof auth === `string` && auth.startsWith(bearerPrefix) ? auth.slice(bearerPrefix.length) : undefined;

      if (token === undefined || context.jwtSecret === ``) {
        return false;
      }

      const payload = Jwt.verify(token, context.jwtSecret);
      if (payload === undefined) {
        return false;
      }

      (request as Request & { userId: number }).userId = payload.userId;

      return true;
    };

    const tryBot = () => {
      const key = request.headers[`x-bot-api-key`];
      const received = typeof key === `string` ? key : ``;
      if (botApiKey === `` || received !== botApiKey) {
        return false;
      }

      const body = request.body as ApiBotBody;

      const telegramId =
        typeof body.telegramId === `number`
          ? body.telegramId
          : Number(typeof request.query[`telegramId`] === `string` ? request.query[`telegramId`] : Number.NaN);
      if (Number.isNaN(telegramId)) {
        return false;
      }

      (request as Request & { telegramId: number }).telegramId = telegramId;

      return true;
    };

    if (tryJwt()) {
      next();

      return;
    }

    if (!tryBot()) {
      response.status(HttpStatus.unauthorized).json({ error: `Unauthorized` });

      return;
    }

    void (async () => {
      const { telegramId } = request as Request & { telegramId: number };
      const user = await Storage.ensureUserByTelegramId(context.db, telegramId);
      (request as Request & { userId: number }).userId = user.id;
      next();
    })();
  };

export const Middleware = { requireBotKey, requireJwt, requireUser, resolveUserIdFromBot };
