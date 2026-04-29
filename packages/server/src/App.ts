/* eslint-disable functional/no-expression-statements */
import type { IncomingMessage, Server, ServerResponse } from "node:http";

import fastifyCookie from "@fastify/cookie";
import { _, HttpStatus } from "@snappy/core";
import { AiTunnelProxy, type ServerApp, SessionUserId } from "@snappy/server-app";
import { TrpcRouter } from "@snappy/trpc";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import { fromNodeHeaders } from "better-auth/node";
import fastify from "fastify";

export type AppConfig = {
  api: ServerApp;
  serverFactory?: (handler: (request: IncomingMessage, response: ServerResponse) => void) => Server;
};

export const App = async ({ api, serverFactory }: AppConfig) => {
  const bodyLimitMegaBytes = 50;
  const bodyLimit = _.mb(bodyLimitMegaBytes);
  const app = fastify({ bodyLimit, routerOptions: { maxParamLength: 5000 }, serverFactory });

  await app.register(fastifyCookie);

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

  await AiTunnelProxy(app, api);

  await app.register(fastifyTRPCPlugin<TrpcRouter>, {
    prefix: `/api/trpc`,
    trpcOptions: {
      createContext: async ({ req }) => ({ api, userId: await SessionUserId(api, req.headers) }),
      router: TrpcRouter(api),
    },
  });

  app.post(`/api/webhooks/yookassa`, async (request, reply) => {
    await api.balancePayment.webhook(request.body);
    await reply.status(HttpStatus.ok).send();
  });

  return app;
};
