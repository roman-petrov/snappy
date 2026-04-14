/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-expression-statements */
import type { ServerApp } from "@snappy/server-app";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { _, HttpStatus } from "@snappy/core";

import { Middleware } from "./Middleware";

export type Route<TSuccess = unknown> = {
  method: `get` | `post`;
  noAuth?: true;
  path: string;
  run: (api: ServerApp, request: FastifyRequest) => Promise<TSuccess | { status: string }>;
  runRaw?: (api: ServerApp, request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  successBody?: (result: TSuccess) => object;
};

type BindOptions = { api: ServerApp; routes: Route[] };

const bind = (app: FastifyInstance, { api, routes }: BindOptions) => {
  for (const route of routes) {
    const handler = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      if (route.runRaw !== undefined) {
        await route.runRaw(api, request, reply);

        return;
      }
      const result = await route.run(api, request);
      if (_.isObject(result) && `status` in result && _.isString(result.status) && result.status !== `ok`) {
        await reply.status(HttpStatus.ok).send({ status: result.status });

        return;
      }

      if (route.successBody !== undefined) {
        await reply.status(HttpStatus.ok).send(route.successBody(result));

        return;
      }
      await reply.status(HttpStatus.internalServerError).send({ status: `internal` });
    };

    const preHandler = route.noAuth === true ? undefined : Middleware.requireUser(api);
    app[route.method](route.path, { preHandler }, handler);
  }
};

export const Router = { bind };
