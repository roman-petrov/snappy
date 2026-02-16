/* eslint-disable functional/no-expression-statements */
import type { ServerAppApi } from "@snappy/server-app";
import type { Request, Response } from "express";

import { HttpStatus } from "@snappy/core";

import { ApiResult } from "./ApiResult";

export type RouteDef<TSuccess = unknown> = {
  auth?: `requireUser`;
  method: `get` | `post`;
  path: string;
  run: (api: ServerAppApi, request: Request) => Promise<{ error: string; status: number } | TSuccess>;
  successBody: (result: TSuccess) => object;
  successStatus: 200 | typeof HttpStatus.created;
};

type RequestWithUserId = Request & { userId?: number };

const getUserId = (request: Request): number | undefined => (request as RequestWithUserId).userId;

const withBody =
  <TBody, TSuccess>(
    run: (api: ServerAppApi, body: TBody) => Promise<{ error: string; status: number } | TSuccess>,
    bodyFromReq: (req: Request) => TBody,
  ) =>
  (api: ServerAppApi, request: Request) =>
    run(api, bodyFromReq(request));

const withUserId =
  <TSuccess>(run: (api: ServerAppApi, userId: number) => Promise<{ error: string; status: number } | TSuccess>) =>
  async (api: ServerAppApi, request: Request): Promise<{ error: string; status: number } | TSuccess> => {
    const id = getUserId(request);
    if (id === undefined) {
      return { error: `Unauthorized`, status: HttpStatus.unauthorized };
    }

    return run(api, id);
  };

const withUserIdAndBody =
  <TBody, TSuccess>(
    run: (api: ServerAppApi, userId: number, body: TBody) => Promise<{ error: string; status: number } | TSuccess>,
    bodyFromReq: (req: Request) => TBody,
  ) =>
  async (api: ServerAppApi, request: Request): Promise<{ error: string; status: number } | TSuccess> => {
    const id = getUserId(request);
    if (id === undefined) {
      return { error: `Unauthorized`, status: HttpStatus.unauthorized };
    }

    return run(api, id, bodyFromReq(request));
  };

const sendResult = (response: Response, def: RouteDef<unknown>, result: unknown): void => {
  if (ApiResult.hasError(result)) {
    response.status(result.status).json({ error: result.error });

    return;
  }

  response.status(def.successStatus).json(def.successBody(result));
};

const createHandler =
  (def: RouteDef<unknown>) =>
  (api: ServerAppApi) =>
  async (request: Request, response: Response): Promise<void> => {
    const result = await def.run(api, request);

    sendResult(response, def, result);
  };

const bindRoutes = (
  app: ReturnType<typeof import("express")>,
  api: ServerAppApi,
  botApiKey: string,
  defs: Array<RouteDef<unknown>>,
  requireUser: (api: ServerAppApi, botApiKey: string) => (req: Request, res: Response, next: () => void) => void,
): void => {
  for (const def of defs) {
    const middlewares =
      def.auth === `requireUser`
        ? [requireUser(api, botApiKey)]
        : ([] as Array<(req: Request, res: Response, next: () => void) => void>);
    const handler = createHandler(def)(api);

    (
      app as {
        get: (path: string, ...handlers: unknown[]) => void;
        post: (path: string, ...handlers: unknown[]) => void;
      }
    )[def.method](def.path, ...middlewares, handler);
  }
};

export const RouteHandler = { bindRoutes, createHandler, withBody, withUserId, withUserIdAndBody };
