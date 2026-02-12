/* eslint-disable functional/no-expression-statements */
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

  app.post(`/api/auth/register`, Auth.register(context));
  app.post(`/api/auth/login`, Auth.login(context));
  app.post(`/api/auth/forgot-password`, Auth.forgotPassword(context));
  app.post(`/api/auth/reset-password`, Auth.resetPassword(context));

  app.get(`/api/user/remaining`, Middleware.requireUser(context, botApiKey), User.remaining(context));
  app.post(`/api/process`, Middleware.requireUser(context, botApiKey), Process.process(context));
  app.post(`/api/premium/payment-url`, Middleware.requireUser(context, botApiKey), Premium.paymentUrl(context));

  return app;
};
