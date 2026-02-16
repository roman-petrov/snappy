/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-expression-statements */
import type { ServerAppApi } from "@snappy/server-app";
import type { Express, Request, Response } from "express";

import { HttpStatus } from "@snappy/core";

import { ApiResult } from "./ApiResult";

export type Route<TSuccess = unknown> = {
  auth?: `requireUser`;
  method: `get` | `post`;
  path: string;
  run: (api: ServerAppApi, request: Request) => Promise<TSuccess | { error: string; status: number }>;
  successBody: (result: TSuccess) => object;
  successStatus: HttpStatus;
};

type RequestWithUserId = Request & { userId?: number };

const getUserId = (request: Request): number | undefined => (request as RequestWithUserId).userId;

const withBody =
  <TBody, TSuccess>(
    run: (api: ServerAppApi, body: TBody) => Promise<TSuccess | { error: string; status: number }>,
    bodyFromRequest: (request: Request) => TBody,
  ) =>
  async (api: ServerAppApi, request: Request) =>
    run(api, bodyFromRequest(request));

const withUserId =
  <TSuccess>(run: (api: ServerAppApi, userId: number) => Promise<TSuccess | { error: string; status: number }>) =>
  async (api: ServerAppApi, request: Request): Promise<TSuccess | { error: string; status: number }> => {
    const id = getUserId(request);
    if (id === undefined) {
      return { error: `Unauthorized`, status: HttpStatus.unauthorized };
    }

    return run(api, id);
  };

const withUserIdAndBody =
  <TBody, TSuccess>(
    run: (api: ServerAppApi, userId: number, body: TBody) => Promise<TSuccess | { error: string; status: number }>,
    bodyFromRequest: (request: Request) => TBody,
  ) =>
  async (api: ServerAppApi, request: Request): Promise<TSuccess | { error: string; status: number }> => {
    const id = getUserId(request);
    if (id === undefined) {
      return { error: `Unauthorized`, status: HttpStatus.unauthorized };
    }

    return run(api, id, bodyFromRequest(request));
  };

const sendResult = (response: Response, route: Route, result: unknown): void => {
  if (ApiResult.hasError(result)) {
    response.status(result.status).json({ error: result.error });

    return;
  }

  response.status(route.successStatus).json(route.successBody(result));
};

const createHandler =
  (route: Route) =>
  (api: ServerAppApi) =>
  async (request: Request, response: Response): Promise<void> => {
    const result = await route.run(api, request);

    sendResult(response, route, result);
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
      route.auth === `requireUser`
        ? [requireUser(api, botApiKey)]
        : ([] as ((request: Request, response: Response, next: () => void) => void)[]);

    const handler = createHandler(route)(api);

    if (route.method === `get`) {
      app.get(route.path, ...middlewares, handler);
    } else {
      app.post(route.path, ...middlewares, handler);
    }
  }
};

export const Router = { bind, createHandler, withBody, withUserId, withUserIdAndBody };
