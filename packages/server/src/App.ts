/* eslint-disable functional/no-expression-statements */
import express from "express";

import { Auth } from "./routes/Auth";
import { Middleware } from "./Middleware";
import { Premium } from "./routes/Premium";
import { Process } from "./routes/Process";
import { User } from "./routes/User";
import type { AppContext } from "./Types";

export type CreateAppOptions = AppContext & { allowCorsOrigin?: string; botApiKey: string };

export const createApp = (options: CreateAppOptions) => {
  const { allowCorsOrigin, botApiKey, db, freeRequestLimit, jwtSecret, premiumPrice, snappy, yooKassa } = options;
  const ctx: AppContext = { db, freeRequestLimit, jwtSecret, premiumPrice, snappy, yooKassa };
  const app = express();

  if (allowCorsOrigin !== undefined && allowCorsOrigin !== ``) {
    app.use((req, res, next) => {
      res.setHeader(`Access-Control-Allow-Origin`, allowCorsOrigin);
      res.setHeader(`Access-Control-Allow-Methods`, `GET, POST, OPTIONS`);
      res.setHeader(`Access-Control-Allow-Headers`, `Content-Type, Authorization`);
      if (req.method === `OPTIONS`) {
        res.sendStatus(204);
        return;
      }
      next();
    });
  }

  app.use(express.json());

  app.post(`/api/auth/register`, Auth.register(ctx));
  app.post(`/api/auth/login`, Auth.login(ctx));
  app.post(`/api/auth/forgot-password`, Auth.forgotPassword(ctx));
  app.post(`/api/auth/reset-password`, Auth.resetPassword(ctx));

  app.get(`/api/user/remaining`, Middleware.requireUser(ctx, botApiKey), User.remaining(ctx));
  app.post(`/api/process`, Middleware.requireUser(ctx, botApiKey), Process.process(ctx));
  app.post(`/api/premium/payment-url`, Middleware.requireUser(ctx, botApiKey), Premium.paymentUrl(ctx));

  return app;
};
