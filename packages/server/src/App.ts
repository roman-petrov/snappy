/* eslint-disable functional/no-expression-statements */
import type { ServerApp } from "@snappy/server-app";

import { HttpStatus } from "@snappy/core";
import { Endpoints } from "@snappy/server-api";
import express from "express";

import { Middleware } from "./Middleware";
import { Auth } from "./routes/Auth";
import { Premium } from "./routes/Premium";
import { Process } from "./routes/Process";
import { User } from "./routes/User";

export type CreateAppOptions = { allowCorsOrigin?: string; api: ServerApp[`api`]; botApiKey: string };

export const createApp = (options: CreateAppOptions) => {
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

  app.post(Endpoints.auth.register, Auth.register(api));
  app.post(Endpoints.auth.login, Auth.login(api));
  app.post(Endpoints.auth.forgotPassword, Auth.forgotPassword(api));
  app.post(Endpoints.auth.resetPassword, Auth.resetPassword(api));

  app.get(Endpoints.user.remaining, Middleware.requireUser(api, botApiKey), User.remaining(api));
  app.post(Endpoints.process, Middleware.requireUser(api, botApiKey), Process.process(api));
  app.post(Endpoints.premium.paymentUrl, Middleware.requireUser(api, botApiKey), Premium.paymentUrl(api));

  return app;
};
