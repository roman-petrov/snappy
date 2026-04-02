/* eslint-disable functional/no-expression-statements */
import type { ServerAppApi } from "@snappy/server-app";
import type { IncomingMessage, Server, ServerResponse } from "node:http";

import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import fastify, { type FastifyInstance } from "fastify";

import { Router } from "./Router";
import { Routes } from "./Routes";

export type CreateAppOptions = {
  allowCorsOrigin?: boolean;
  api: ServerAppApi;
  serverFactory?: (handler: (request: IncomingMessage, response: ServerResponse) => void) => Server;
};

const createApp = async ({
  allowCorsOrigin = false,
  api,
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

  return app;
};

export const App = { createApp };
