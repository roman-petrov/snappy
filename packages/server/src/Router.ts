/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-expression-statements */
import type { ServerAppApi } from "@snappy/server-app";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { _, HttpStatus } from "@snappy/core";

import { AuthCookie } from "./AuthCookie";
import { Middleware } from "./Middleware";

const genericStatusToHttp: Record<string, number> = {
  jwtUnavailable: HttpStatus.serviceUnavailable,
  unauthorized: HttpStatus.unauthorized,
};

export type Route<TSuccess = unknown> = {
  auth?: boolean;
  clearAuthCookie?: boolean;
  method: `get` | `post`;
  path: string;
  run: (api: ServerAppApi, request: FastifyRequest) => Promise<TSuccess | { status: string }>;
  setAuthCookie?: boolean;
  successBody: (result: TSuccess) => object;
};

type BindOptions = { api: ServerAppApi; botApiKey: string; routes: Route[] };

const bind = (app: FastifyInstance, { api, botApiKey, routes }: BindOptions) => {
  for (const route of routes) {
    const handler = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      const result = await route.run(api, request);
      if (_.isObject(result) && `status` in result && _.isString(result.status) && result.status !== `ok`) {
        await reply.status(genericStatusToHttp[result.status] ?? HttpStatus.ok).send({ status: result.status });

        return;
      }

      const token = _.isObject(result) && `token` in result ? (result as { token: unknown }).token : undefined;
      if (route.setAuthCookie === true && _.isString(token)) {
        reply.setCookie(AuthCookie.name, token, {
          httpOnly: true,
          maxAge: AuthCookie.maxAgeMs / _.second,
          path: `/`,
          sameSite: `lax`,
        });
      }
      if (route.clearAuthCookie === true) {
        reply.clearCookie(AuthCookie.name, { path: `/` });
      }
      await reply.status(HttpStatus.ok).send(route.successBody(result));
    };

    const preHandler = route.auth === true ? Middleware.requireUser(api, botApiKey) : undefined;
    app[route.method](route.path, { preHandler }, handler);
  }
};

export const Router = { bind };
