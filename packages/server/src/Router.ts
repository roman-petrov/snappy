/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-expression-statements */
import type { ServerAppApi } from "@snappy/server-app";
import type { Express, Request, Response } from "express";

import { HttpStatus } from "@snappy/core";

import { AuthCookie } from "./AuthCookie";
import { Middleware } from "./Middleware";

export type Route<TSuccess = unknown> = {
  auth?: boolean;
  clearAuthCookie?: boolean;
  method: `get` | `post`;
  path: string;
  run: (api: ServerAppApi, request: Request) => Promise<TSuccess | { error: string; status: number }>;
  setAuthCookie?: boolean;
  successBody: (result: TSuccess) => object;
  successStatus?: HttpStatus;
};

const hasError = (r: unknown): r is { error: string; status: number } =>
  typeof r === `object` && r !== null && `error` in r && `status` in r;

const hasToken = (r: object): r is { token: string } =>
  `token` in r && typeof (r as { token: unknown }).token === `string`;

type BindOptions = { api: ServerAppApi; botApiKey: string; routes: Route[] };

const bind = (app: Express, options: BindOptions): void => {
  const { api, botApiKey, routes } = options;

  for (const route of routes) {
    const handler = async (request: Request, response: Response): Promise<void> => {
      const result = await route.run(api, request);
      if (hasError(result)) {
        response.status(result.status).json({ error: result.error });

        return;
      }

      const body = route.successBody(result);
      if (route.setAuthCookie === true && hasToken(result as object)) {
        response.cookie(AuthCookie.name, (result as { token: string }).token, {
          httpOnly: true,
          maxAge: AuthCookie.maxAgeMs,
          sameSite: `lax`,
        });
      }
      if (route.clearAuthCookie === true) {
        response.clearCookie(AuthCookie.name);
      }
      response.status(route.successStatus ?? HttpStatus.ok).json(body);
    };

    const middlewares = route.auth === true ? [Middleware.requireUser(api, botApiKey)] : [];
    if (route.method === `get`) {
      app.get(route.path, ...middlewares, handler);
    } else {
      app.post(route.path, ...middlewares, handler);
    }
  }
};

export const Router = { bind };
