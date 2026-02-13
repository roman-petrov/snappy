/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
import type { ApiBotBody } from "@snappy/server-api";
import type { Request, Response } from "express";

import { _, HttpStatus } from "@snappy/core";

import type { AppContext } from "./Types";

import { Jwt } from "./Jwt";
import { Storage } from "./Storage";

const bearerPrefix = `Bearer `;

const parseBearerToken = (auth: string | undefined): string | undefined =>
  _.isString(auth) && auth.startsWith(bearerPrefix) ? auth.slice(bearerPrefix.length) : undefined;

const parseBotTelegramId = (request: Request): number | undefined => {
  const body = request.body as ApiBotBody;
  const raw = _.isNumber(body.telegramId) ? body.telegramId : request.query[`telegramId`];
  const num = _.isString(raw) ? Number(raw) : _.isNumber(raw) ? raw : Number.NaN;

  return Number.isNaN(num) ? undefined : num;
};

const requireJwt = (context: AppContext) => (request: Request, response: Response, next: () => void) => {
  const token = parseBearerToken(request.headers.authorization);

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
  const received = request.headers[`x-bot-api-key`];
  const key = _.isString(received) ? received : ``;

  if (botApiKey === `` || key !== botApiKey) {
    response.status(HttpStatus.unauthorized).json({ error: `Unauthorized` });

    return;
  }

  const telegramId = parseBotTelegramId(request);
  if (telegramId === undefined) {
    response.status(HttpStatus.badRequest).json({ error: `telegramId required` });

    return;
  }

  (request as Request & { telegramId: number }).telegramId = telegramId;
  next();
};

const requireUser =
  (context: AppContext, botApiKey: string) => (request: Request, response: Response, next: () => void) => {
    const tryJwt = (): boolean => {
      const token = parseBearerToken(request.headers.authorization);
      if (token === undefined || context.jwtSecret === ``) {return false;}

      const payload = Jwt.verify(token, context.jwtSecret);
      if (payload === undefined) {return false;}

      (request as Request & { userId: number }).userId = payload.userId;

      return true;
    };

    const tryBot = (): boolean => {
      const key = request.headers[`x-bot-api-key`];
      const received = _.isString(key) ? key : ``;
      if (botApiKey === `` || received !== botApiKey) {return false;}

      const telegramId = parseBotTelegramId(request);
      if (telegramId === undefined) {return false;}

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

export const Middleware = { requireBotKey, requireJwt, requireUser };
