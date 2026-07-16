/* eslint-disable functional/no-expression-statements */
import type { FastifyInstance } from "fastify";

import { Config, ConfigValues } from "@snappy/config";
import { Db } from "@snappy/db";
import { Payment } from "@snappy/payment";
import { Rpc } from "@snappy/rpc/server";

import { Balance } from "./Balance";
import { BalancePayment } from "./BalancePayment";
import { BetterAuth } from "./BetterAuth";
import { AiTunnelProxy, RobokassaWebhook } from "./billing";
import { Feed } from "./Feed";
import { Images } from "./Images";
import { PaymentLog } from "./PaymentLog";
import { RpcContract } from "./RpcContract";
import { Session } from "./Session";
import { SharedConfig } from "./SharedConfig";
import { UserSettings } from "./UserSettings";

export type AppConfig = { app: FastifyInstance };

export const App = async ({ app }: AppConfig) => {
  const db = Db(Config.dbUrl());
  const balance = Balance(db);
  const config = SharedConfig();
  const settings = UserSettings(db);
  const feed = Feed(db);
  const betterAuth = BetterAuth({ balance, db });

  const payment = Payment({
    credentials: {
      isTest: !ConfigValues.production(),
      merchantLogin: Config.roboKassaMerchantLogin(),
      password1: Config.roboKassaPassword1(),
      password2: Config.roboKassaPassword2(),
    },
    type: `robo-kassa`,
  });

  const paymentLog = PaymentLog(db);
  const billing = BalancePayment({ balance, db, payment, paymentLog });

  app.route({
    handler: async (request, reply) => {
      const url = new URL(request.url, `http://${request.hostname}`);
      const authHeaders = Session.headers(request.headers);
      authHeaders.set(`x-forwarded-for`, request.ip);

      const authRequest = new Request(url.toString(), {
        body: request.body === undefined ? undefined : JSON.stringify(request.body),
        headers: authHeaders,
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

  await AiTunnelProxy(app, { balance, betterAuth, db });

  await Rpc.mount(app, RpcContract, {
    context: async ({ req }) => Session.context(betterAuth, req.headers, db),
    modules: { balance, billing, config, feed, settings },
    userId: ({ dbUser }) => dbUser.id,
  });

  Images.mount({ app, betterAuth, db });

  await RobokassaWebhook(app, { balancePayment: billing, payment });
};
