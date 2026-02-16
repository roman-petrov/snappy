/* eslint-disable functional/no-expression-statements */
import type { ServerAppApi } from "@snappy/server-app";

import { HttpStatus } from "@snappy/core";
import express from "express";

import { Middleware } from "./Middleware";
import { RouteDefs } from "./RouteDefs";
import { RouteHandler } from "./RouteHandler";

export type CreateAppOptions = { allowCorsOrigin?: string; api: ServerAppApi; botApiKey: string };

const createApp = (options: CreateAppOptions) => {
  const { allowCorsOrigin, api, botApiKey } = options;
  const app = express();
  const corsOrigin = allowCorsOrigin ?? ``;

  if (corsOrigin !== ``) {
    app.use((request, response, next) => {
      response.setHeader(`Access-Control-Allow-Origin`, corsOrigin);
      response.setHeader(`Access-Control-Allow-Methods`, `GET, POST, OPTIONS`);
      response.setHeader(`Access-Control-Allow-Headers`, `Content-Type, Authorization`);
      if (request.method === `OPTIONS`) {
        response.sendStatus(HttpStatus.noContent);

        return;
      }
      next();
    });
  }

  app.use(express.json());
  RouteHandler.bindRoutes(app, api, botApiKey, RouteDefs, Middleware.requireUser);

  return app;
};

export const App = { createApp };
