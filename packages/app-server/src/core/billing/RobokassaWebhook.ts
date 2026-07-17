/* eslint-disable functional/no-expression-statements */
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { Config, ConfigValues } from "@snappy/config";
import { HttpStatus } from "@snappy/core";
import { type PaymentProvider, RobokassaConfig } from "@snappy/payment";
import { TunnelClient, TunnelHub } from "@snappy/tunnel";

import type { BalancePayment } from "../BalancePayment";

export type RobokassaWebhookConfig = { balancePayment: BalancePayment; payment: PaymentProvider };

export const RobokassaWebhook = async (app: FastifyInstance, { balancePayment, payment }: RobokassaWebhookConfig) => {
  const path = `/api/webhooks/robokassa`;
  const wsPath = `/api/tunnel`;
  const key = Config.tunnelKey();

  const handle = async (request: FastifyRequest, reply: FastifyReply) => {
    const body = await balancePayment.webhook(request.body);
    if (body === undefined) {
      await reply.status(HttpStatus.ok).send();

      return;
    }
    await reply.status(HttpStatus.ok).type(`text/plain`).send(body);
  };

  if (!ConfigValues.production()) {
    app.post(path, handle);

    return TunnelClient({ key, url: `wss://${ConfigValues.prodHost}${wsPath}` });
  }

  const { online, proxy } = await TunnelHub({ key }).register(app, wsPath);

  app.post(path, async (request, reply) => {
    if (!RobokassaConfig.allowsIp(request.ip)) {
      await reply.status(HttpStatus.forbidden).send();

      return;
    }
    if (payment.parseWebhook(request.body).ok) {
      await handle(request, reply);

      return;
    }
    if (online()) {
      await proxy(reply, path, { json: request.body });

      return;
    }
    await reply.status(HttpStatus.ok).send();
  });

  return undefined;
};
