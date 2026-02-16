/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-expression-statements */
import type { ServerAppApi } from "@snappy/server-app";
import type { Express, Request, Response } from "express";

import { HttpStatus } from "@snappy/core";

import { ApiResult } from "./ApiResult";

export type Route<TSuccess = unknown> = {
  auth?: boolean;
  method: `get` | `post`;
  path: string;
  run: (api: ServerAppApi, request: Request) => Promise<TSuccess | { error: string; status: number }>;
  successBody: (result: TSuccess) => object;
  successStatus?: HttpStatus;
};

const bind = (
  app: Express,
  api: ServerAppApi,
  botApiKey: string,
  routes: Route[],
  requireUser: (
    api: ServerAppApi,
    botApiKey: string,
  ) => (request: Request, response: Response, next: () => void) => void,
): void => {
  for (const route of routes) {
    const middlewares =
      route.auth === true
        ? [requireUser(api, botApiKey)]
        : ([] as ((request: Request, response: Response, next: () => void) => void)[]);

    const handler = async (request: Request, response: Response): Promise<void> => {
      const result = await route.run(api, request);
      if (ApiResult.hasError(result)) {
        response.status(result.status).json({ error: result.error });

        return;
      }
      response.status(route.successStatus ?? HttpStatus.ok).json(route.successBody(result));
    };

    if (route.method === `get`) {
      app.get(route.path, ...middlewares, handler);
    } else {
      app.post(route.path, ...middlewares, handler);
    }
  }
};

export const Router = { bind };
