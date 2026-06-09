/* eslint-disable functional/no-expression-statements */
import type { IncomingMessage, Server, ServerResponse } from "node:http";

import fastifyCookie from "@fastify/cookie";
import { _ } from "@snappy/core";
import fastify from "fastify";

export type FastifyConfig = {
  serverFactory?: (handler: (request: IncomingMessage, response: ServerResponse) => void) => Server;
};

export const Fastify = async ({ serverFactory }: FastifyConfig = {}) => {
  const bodyLimitMegaBytes = 50;
  const bodyLimit = _.mb(bodyLimitMegaBytes);
  const app = fastify({ bodyLimit, routerOptions: { maxParamLength: 5000 }, serverFactory, trustProxy: true });

  await app.register(fastifyCookie);

  return app;
};
