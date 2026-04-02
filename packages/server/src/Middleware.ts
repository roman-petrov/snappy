/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
import type { ServerAppApi } from "@snappy/server-app";
import type { FastifyReply, FastifyRequest } from "fastify";

import { HttpStatus } from "@snappy/core";

import { AuthCookie } from "./AuthCookie";

type RequestWithUserId = FastifyRequest & { userId?: number };

const requireUser =
  (api: ServerAppApi) =>
  async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const token = AuthCookie.token(request.headers.cookie ?? ``);

    if (token === undefined) {
      await reply.status(HttpStatus.unauthorized).send({ status: `unauthorized` });

      return;
    }

    const payload = api.auth.verify(token);
    if (payload === undefined) {
      await reply.status(HttpStatus.unauthorized).send({ status: `unauthorized` });

      return;
    }

    (request as RequestWithUserId).userId = payload.userId;
  };

export const Middleware = { requireUser };
