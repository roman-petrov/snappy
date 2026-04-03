/* eslint-disable functional/no-expression-statements */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import type { BridgeRegistry, ServerAppApi } from "@snappy/server-app";
import type { IncomingMessage, Server, ServerResponse } from "node:http";

import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import { HttpStatus, Json } from "@snappy/core";
import { Endpoints } from "@snappy/server-api";
import fastify, { type FastifyInstance, type FastifyReply, type FastifyRequest } from "fastify";

import { Middleware } from "./Middleware";
import { Router } from "./Router";
import { Routes } from "./Routes";

export type CreateAppOptions = {
  allowCorsOrigin?: boolean;
  api: ServerAppApi;
  bridge?: BridgeRegistry;
  serverFactory?: (handler: (request: IncomingMessage, response: ServerResponse) => void) => Server;
};

const createApp = async ({
  allowCorsOrigin = false,
  api,
  bridge,
  serverFactory,
}: CreateAppOptions): Promise<FastifyInstance> => {
  const app = fastify({ logger: false, serverFactory }) as FastifyInstance;

  await app.register(fastifyCookie);
  if (allowCorsOrigin) {
    await app.register(fastifyCors, {
      allowedHeaders: [`Content-Type`],
      credentials: true,
      methods: [`GET`, `POST`, `OPTIONS`],
      origin: true,
    });
  }

  Router.bind(app, { api, routes: Routes });

  if (bridge !== undefined) {
    const fastifyWebsocket = (await import(`@fastify/websocket`)).default;
    await app.register(fastifyWebsocket);
    app.get(`/api/ws/bridge`, { websocket: true }, (socket, _request: FastifyRequest) => {
      socket.on(`message`, (raw: Buffer | string) => {
        const text = typeof raw === `string` ? raw : raw.toString(`utf8`);

        const registerMessage = (() => {
          try {
            return Json.parse<{
              models?: unknown;
              offered?: unknown;
              public?: unknown;
              relayKey?: string;
              type?: string;
            }>(text);
          } catch {
            return undefined;
          }
        })();
        if (
          registerMessage?.type === `register` &&
          typeof registerMessage.relayKey === `string` &&
          bridge.validateRelayKey(registerMessage.relayKey)
        ) {
          const parsed = bridge.parseOffered(registerMessage.offered);

          const offered =
            parsed === undefined
              ? bridge.normalizeLegacyNames(
                  Array.isArray(registerMessage.models)
                    ? registerMessage.models.filter((m): m is string => typeof m === `string`)
                    : [],
                )
              : parsed;
          bridge.attachSocket(registerMessage.relayKey, socket as never, {
            offered,
            public: registerMessage.public === true,
          });
        }
      });
    });
  }

  type RequestWithUserId = FastifyRequest & { userId?: number };

  app.get(
    Endpoints.files.download(`:id`),
    { preHandler: Middleware.requireUser(api) },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { userId } = request as RequestWithUserId;
      const { id } = request.params as { id?: string };
      if (userId === undefined || id === undefined) {
        await reply.status(HttpStatus.badRequest).send({ status: `badRequest` });

        return;
      }
      const result = await api.files.read(userId, id);
      if (result.status !== `ok`) {
        await reply.status(HttpStatus.notFound).send({ status: `notFound` });

        return;
      }
      await reply.type(result.mime).send(result.buffer);
    },
  );

  return app;
};

export const App = { createApp };
