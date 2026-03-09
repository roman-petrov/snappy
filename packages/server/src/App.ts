/* eslint-disable functional/no-expression-statements */
import type { ServerAppApi } from "@snappy/server-app";
import type { IncomingMessage, Server, ServerResponse } from "node:http";

import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import fastify, { type FastifyInstance } from "fastify";

import { Router } from "./Router";
import { Routes } from "./Routes";

export type CreateAppOptions = {
  allowCorsOrigin?: string;
  api: ServerAppApi;
  botApiKey: string;
  serverFactory?: (handler: (request: IncomingMessage, response: ServerResponse) => void) => Server;
};

const createApp = async ({
  allowCorsOrigin,
  api,
  botApiKey,
  serverFactory,
}: CreateAppOptions): Promise<FastifyInstance> => {
  const app = fastify({ logger: false, serverFactory }) as FastifyInstance;

  await app.register(fastifyCookie);
  if (allowCorsOrigin !== undefined && allowCorsOrigin !== ``) {
    await app.register(fastifyCors, {
      allowedHeaders: [`Content-Type`, `X-Bot-Api-Key`],
      credentials: true,
      methods: [`GET`, `POST`, `OPTIONS`],
      origin: allowCorsOrigin,
    });
  }

  Router.bind(app, { api, botApiKey, routes: Routes });

  return app;
};

export const App = { createApp };
