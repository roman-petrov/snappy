/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
import type { ApiBotBody } from "@snappy/server-api";
import type { ServerAppApi } from "@snappy/server-app";
import type { FastifyReply, FastifyRequest } from "fastify";

import { _, HttpStatus } from "@snappy/core";

import { AuthCookie } from "./AuthCookie";

type RequestWithTelegramId = FastifyRequest & { telegramId?: number };

type RequestWithUserId = FastifyRequest & { userId?: number };

const requireUser =
  (api: ServerAppApi, botApiKey: string) =>
  async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const tryJwt = () => {
      const token = AuthCookie.token(request.headers.cookie ?? ``);

      if (token === undefined) {
        return false;
      }

      const payload = api.jwt.verify(token);
      if (payload === undefined) {
        return false;
      }

      (request as RequestWithUserId).userId = payload.userId;

      return true;
    };

    const tryBot = () => {
      const key = request.headers[`x-bot-api-key`];
      const received = _.isString(key) ? key : ``;
      if (botApiKey === `` || received !== botApiKey) {
        return false;
      }

      const body = request.body as ApiBotBody | undefined;

      const raw = _.isNumber(body?.telegramId)
        ? body.telegramId
        : (request.query as { telegramId?: unknown }).telegramId;

      const numberValue = _.isString(raw) ? Number(raw) : _.isNumber(raw) ? raw : Number.NaN;
      const telegramId = Number.isNaN(numberValue) ? undefined : numberValue;
      if (telegramId === undefined) {
        return false;
      }

      (request as RequestWithTelegramId).telegramId = telegramId;

      return true;
    };

    if (tryJwt()) {
      return;
    }

    if (!tryBot()) {
      await reply.status(HttpStatus.unauthorized).send({ status: `unauthorized` });

      return;
    }

    const { telegramId } = request as RequestWithTelegramId;
    if (telegramId === undefined) {
      await reply.status(HttpStatus.unauthorized).send({ status: `unauthorized` });

      return;
    }
    const user = await api.ensureUserByTelegramId(telegramId);
    (request as RequestWithUserId).userId = user.id;
  };

export const Middleware = { requireUser };
