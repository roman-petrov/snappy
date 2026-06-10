/* eslint-disable functional/no-expression-statements */
import type { FastifyInstance } from "fastify";

import { Config } from "@snappy/config";
import { HttpStatus } from "@snappy/core";
import { Db } from "@snappy/db";
import { Payment } from "@snappy/payment";
import { Trpc } from "@snappy/server-module";
import { fromNodeHeaders } from "better-auth/node";

import { Balance } from "./Balance";
import { BalancePayment } from "./BalancePayment";
import { BetterAuth } from "./BetterAuth";
import { AiTunnelProxy } from "./billing";
import { Feed } from "./Feed";
import { PaymentLog } from "./PaymentLog";
import { Session } from "./Session";
import { TrpcRouter } from "./TrpcRouter";
import { UserSettings } from "./UserSettings";

export type AppConfig = { app: FastifyInstance };

export const App = async ({ app }: AppConfig) => {
  const db = Db(Config.dbUrl());
  const betterAuth = BetterAuth({ auth: db.auth });

  const payment = Payment({
    credentials: { secretKey: Config.yooKassaSecretKey(), shopId: Config.yooKassaShopId() },
    type: `yoo-kassa`,
  });

  const paymentLog = PaymentLog(db);
  const balancePayment = BalancePayment({ db, payment, paymentLog });
  const serverApp = { balance: Balance, balancePayment, betterAuth, feed: Feed, userSettings: UserSettings };

  app.route({
    handler: async (request, reply) => {
      const url = new URL(request.url, `http://${request.headers.host ?? `localhost`}`);
      const headers = new Headers(fromNodeHeaders(request.headers));
      headers.set(`x-forwarded-for`, request.ip);

      const authRequest = new Request(url.toString(), {
        body: request.body === undefined ? undefined : JSON.stringify(request.body),
        headers,
        method: request.method,
      });

      const response = await betterAuth.handler(authRequest);
      reply.status(response.status);
      reply.headers(Object.fromEntries(response.headers.entries()));
      const text = await response.text();
      await reply.send(text === `` ? undefined : text);
    },
    method: [`GET`, `POST`],
    url: `/api/auth/*`,
  });

  await AiTunnelProxy(app, { balance: Balance, betterAuth, db });

  await Trpc.register({
    app,
    context: async ({ req }) => ({ dbUser: await Session.dbUser(betterAuth, req.headers, db) }),
    prefix: `/api/trpc`,
    router: TrpcRouter(serverApp),
  });

  app.post(`/api/webhooks/yookassa`, async (request, reply) => {
    await balancePayment.webhook(request.body);
    await reply.status(HttpStatus.ok).send();
  });
};
