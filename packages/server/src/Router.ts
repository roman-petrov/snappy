/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-expression-statements */
import type { ServerAppApi } from "@snappy/server-app";
import type { Express, Request, Response } from "express";

import { _, HttpStatus } from "@snappy/core";

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

type BindOptions = { api: ServerAppApi; botApiKey: string; routes: Route[] };

const bind = (app: Express, { api, botApiKey, routes }: BindOptions): void => {
  for (const route of routes) {
    const handler = async (request: Request, response: Response): Promise<void> => {
      const result = await route.run(api, request);
      if (
        _.isObject(result) &&
        `error` in result &&
        `status` in result &&
        _.isString(result.error) &&
        _.isNumber(result.status)
      ) {
        response.status(result.status).json({ error: result.error });

        return;
      }

      const token = _.isObject(result) && `token` in result ? (result as { token: unknown }).token : undefined;
      if (route.setAuthCookie === true && _.isString(token)) {
        response.cookie(AuthCookie.name, token, { httpOnly: true, maxAge: AuthCookie.maxAgeMs, sameSite: `lax` });
      }
      if (route.clearAuthCookie === true) {
        response.clearCookie(AuthCookie.name);
      }
      response.status(route.successStatus ?? HttpStatus.ok).json(route.successBody(result));
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
