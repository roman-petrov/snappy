/* eslint-disable functional/no-expression-statements */
import type { ServerAppApi } from "@snappy/server-app";
import type { IncomingMessage, Server, ServerResponse } from "node:http";

import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import { _ } from "@snappy/core";
import fastify, { type FastifyInstance } from "fastify";

import { registerJsonBodyParser } from "./JsonBody";
import { Router } from "./Router";
import { Routes } from "./Routes";

export type CreateAppOptions = {
  allowCorsOrigin?: boolean;
  api: ServerAppApi;
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
