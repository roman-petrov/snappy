/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
import type { ServerApp } from "@snappy/server-app";
import type { FastifyReply, FastifyRequest } from "fastify";

import { HttpStatus } from "@snappy/core";
import { fromNodeHeaders } from "better-auth/node";

export type RequestWithUserId = FastifyRequest & { userId: string };

const requireUser =
  (api: ServerApp) =>
  async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const session = await api.betterAuth.api.getSession({ headers: fromNodeHeaders(request.headers) });
    const userId = session?.user.id;
    if (userId === undefined || userId === ``) {
      await reply.status(HttpStatus.unauthorized).send({ status: `unauthorized` });

      return;
    }
    (request as RequestWithUserId).userId = userId;
  };

export const Middleware = { requireUser };
