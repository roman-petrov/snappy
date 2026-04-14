/* eslint-disable functional/no-expression-statements */
import type { ServerApp } from "@snappy/server-app";
import type { IncomingMessage, Server, ServerResponse } from "node:http";

import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import { Config } from "@snappy/config";
import { _ } from "@snappy/core";
import { fromNodeHeaders } from "better-auth/node";
import fastify, { type FastifyInstance } from "fastify";

import { registerJsonBodyParser } from "./JsonBody";
import { Router } from "./Router";
import { Routes } from "./Routes";

export type CreateAppOptions = {
  allowCorsOrigin?: boolean;
  api: ServerApp;
  serverFactory?: (handler: (request: IncomingMessage, response: ServerResponse) => void) => Server;
};

const createApp = async ({ allowCorsOrigin = false, api, serverFactory }: CreateAppOptions) => {
  const bodyLimitMegaBytes = 50;
  const bodyLimit = _.mb(bodyLimitMegaBytes);
  const app = fastify({ bodyLimit, logger: false, serverFactory }) as FastifyInstance;
  registerJsonBodyParser(app);

  await app.register(fastifyCookie);
  if (allowCorsOrigin) {
    await app.register(fastifyCors, {
      allowedHeaders: [`Content-Type`, `Authorization`, `X-Requested-With`],
      credentials: true,
      maxAge: 86_400,
      methods: [`GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`],
      origin: Config.origin,
    });
  }

  app.route({
    handler: async (request, reply) => {
      const url = new URL(request.url, `http://${request.headers.host ?? `localhost`}`);

      const authRequest = new Request(url.toString(), {
        body: request.body === undefined ? undefined : JSON.stringify(request.body),
        headers: fromNodeHeaders(request.headers),
        method: request.method,
      });

      const response = await api.betterAuth.handler(authRequest);
      reply.status(response.status);
      reply.headers(Object.fromEntries(response.headers.entries()));
      const text = await response.text();
      await reply.send(text === `` ? undefined : text);
    },
    method: [`GET`, `POST`],
    url: `/api/auth/*`,
  });

  Router.bind(app, { api, routes: Routes });

  return app;
};

export const App = { createApp };
