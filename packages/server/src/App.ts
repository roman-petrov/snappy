/* eslint-disable functional/no-expression-statements */
import type { ServerAppApi } from "@snappy/server-app";

import { HttpStatus } from "@snappy/core";
import express from "express";

import { Router } from "./Router";
import { Routes } from "./Routes";

export type CreateAppOptions = { allowCorsOrigin?: string; api: ServerAppApi; botApiKey: string };

const createApp = (options: CreateAppOptions) => {
  const { allowCorsOrigin, api, botApiKey } = options;
  const app = express();
  const corsOrigin = allowCorsOrigin ?? ``;

  if (corsOrigin !== ``) {
    app.use((request, response, next) => {
      response.setHeader(`Access-Control-Allow-Origin`, corsOrigin);
      response.setHeader(`Access-Control-Allow-Credentials`, `true`);
      response.setHeader(`Access-Control-Allow-Methods`, `GET, POST, OPTIONS`);
      response.setHeader(`Access-Control-Allow-Headers`, `Content-Type, X-Bot-Api-Key`);
      if (request.method === `OPTIONS`) {
        response.sendStatus(HttpStatus.noContent);

        return;
      }
      next();
    });
  }

  app.use(express.json());

  Router.bind(app, { api, botApiKey, routes: Routes });

  return app;
};

export const App = { createApp };
