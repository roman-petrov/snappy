/* eslint-disable functional/no-expression-statements */
import type { FastifyInstance } from "fastify";

import { TrpcRouter } from "@snappy/app-server-api";
import { Config } from "@snappy/config";
import { HttpStatus } from "@snappy/core";
import { Db } from "@snappy/db";
import { Payment } from "@snappy/payment";
import { Trpc } from "@snappy/server-module";
import { fromNodeHeaders } from "better-auth/node";

import { AiTunnelProxy } from "./AiTunnelProxy";
import { Balance } from "./Balance";
import { BalancePayment } from "./BalancePayment";
import { BetterAuth } from "./BetterAuth";
import { PaymentLog } from "./PaymentLog";
import { SessionUserId } from "./SessionUserId";
import { UserSettings } from "./UserSettings";

export type AppConfig = { app: FastifyInstance };

export const App = async ({ app }: AppConfig) => {
  const db = Db(Config.dbUrl);
  const betterAuth = BetterAuth({ prisma: db.prisma });

  const payment = Payment({
    credentials: { secretKey: Config.yooKassaSecretKey, shopId: Config.yooKassaShopId },
    type: `yoo-kassa`,
  });

  const paymentLog = PaymentLog(db.paymentLog);
  const balance = Balance({ balanceMinRub: Config.balanceMinRub, userBalance: db.userBalance });

  const balancePayment = BalancePayment({
    balance,
    balancePaymentMaxRub: Config.balancePaymentMaxRub,
    balancePaymentMinRub: Config.balancePaymentMinRub,
    payment,
    paymentLog,
  });

  const userSettings = UserSettings({ userSettings: db.userSettings });

  app.route({
    handler: async (request, reply) => {
      const url = new URL(request.url, `http://${request.headers.host ?? `localhost`}`);

      const authRequest = new Request(url.toString(), {
        body: request.body === undefined ? undefined : JSON.stringify(request.body),
        headers: fromNodeHeaders(request.headers),
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

  await AiTunnelProxy(app, { balance, betterAuth });

  await Trpc.register({
    app,
    context: async ({ req }) => ({ userId: await SessionUserId(betterAuth, req.headers) }),
    prefix: `/api/trpc`,
    router: TrpcRouter({ balance, balancePayment, betterAuth, db, userSettings }),
  });

  app.post(`/api/webhooks/yookassa`, async (request, reply) => {
    await balancePayment.webhook(request.body);
    await reply.status(HttpStatus.ok).send();
  });
};
