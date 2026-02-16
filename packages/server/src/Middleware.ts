/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
import type { ApiBotBody } from "@snappy/server-api";
import type { ServerAppApi } from "@snappy/server-app";
import type { Request, Response } from "express";

import { _, HttpStatus } from "@snappy/core";

import { AuthCookie } from "./AuthCookie";

const requireUser =
  (api: ServerAppApi, botApiKey: string) => async (request: Request, response: Response, next: () => void) => {
    const tryJwt = () => {
      const token = AuthCookie.token(request.headers.cookie ?? ``);

      if (token === undefined) {
        return false;
      }

      const payload = api.jwt.verify(token);
      if (payload === undefined) {
        return false;
      }

      (request as Request & { userId: number }).userId = payload.userId;

      return true;
    };

    const tryBot = () => {
      const key = request.headers[`x-bot-api-key`];
      const received = _.isString(key) ? key : ``;
      if (botApiKey === `` || received !== botApiKey) {
        return false;
      }

      const body = request.body as ApiBotBody | undefined;
      const raw = _.isNumber(body?.telegramId) ? body.telegramId : request.query[`telegramId`];
      const numberValue = _.isString(raw) ? Number(raw) : _.isNumber(raw) ? raw : Number.NaN;
      const telegramId = Number.isNaN(numberValue) ? undefined : numberValue;
      if (telegramId === undefined) {
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
      response.status(HttpStatus.unauthorized).json({ status: `unauthorized` });

      return;
    }

    const { telegramId } = request as Request & { telegramId: number };
    const user = await api.ensureUserByTelegramId(telegramId);
    (request as Request & { userId: number }).userId = user.id;
    next();
  };

export const Middleware = { requireUser };
