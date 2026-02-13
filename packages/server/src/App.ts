/* eslint-disable functional/no-expression-statements */
import { Endpoints } from "@snappy/server-api";
import express from "express";

import type { AppContext } from "./Types";

import { Middleware } from "./Middleware";
import { Auth } from "./routes/Auth";
import { Premium } from "./routes/Premium";
import { Process } from "./routes/Process";
import { User } from "./routes/User";

export type CreateAppOptions = AppContext & { allowCorsOrigin?: string; botApiKey: string };

export const createApp = (options: CreateAppOptions) => {
  const { allowCorsOrigin, botApiKey, db, freeRequestLimit, jwtSecret, premiumPrice, snappy, yooKassa } = options;
  const context: AppContext = { db, freeRequestLimit, jwtSecret, premiumPrice, snappy, yooKassa };
  const app = express();

  if (allowCorsOrigin !== undefined && allowCorsOrigin !== ``) {
    app.use((request, res, next) => {
      res.setHeader(`Access-Control-Allow-Origin`, allowCorsOrigin);
      res.setHeader(`Access-Control-Allow-Methods`, `GET, POST, OPTIONS`);
      res.setHeader(`Access-Control-Allow-Headers`, `Content-Type, Authorization`);
      if (request.method === `OPTIONS`) {
        res.sendStatus(204);

        return;
      }
      next();
    });
  }

  app.use(express.json());

  app.post(Endpoints.auth.register, Auth.register(context));
  app.post(Endpoints.auth.login, Auth.login(context));
  app.post(Endpoints.auth.forgotPassword, Auth.forgotPassword(context));
  app.post(Endpoints.auth.resetPassword, Auth.resetPassword(context));

  app.get(Endpoints.user.remaining, Middleware.requireUser(context, botApiKey), User.remaining(context));
  app.post(Endpoints.process, Middleware.requireUser(context, botApiKey), Process.process(context));
  app.post(Endpoints.premium.paymentUrl, Middleware.requireUser(context, botApiKey), Premium.paymentUrl(context));

  return app;
};
