/* eslint-disable functional/no-expression-statements */
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { Config, ConfigValues } from "@snappy/config";
import { _, HttpStatus } from "@snappy/core";
import { Log } from "@snappy/log";
import { type PaymentProvider, RobokassaConfig } from "@snappy/payment";
import { TunnelClient, TunnelHub } from "@snappy/tunnel";

import type { BalancePayment } from "../BalancePayment";

export type RobokassaWebhookConfig = { balancePayment: BalancePayment; payment: PaymentProvider };

export const RobokassaWebhook = async (app: FastifyInstance, { balancePayment, payment }: RobokassaWebhookConfig) => {
  const path = `/api/webhooks/robokassa`;
  const wsPath = `/api/tunnel`;
  const key = Config.tunnelKey();

  const hint = (body: unknown) =>
    !(body instanceof Object) || _.isArray(body)
      ? {}
      : { invId: `InvId` in body ? body.InvId : undefined, outSum: `OutSum` in body ? body.OutSum : undefined };

  const handle = async ({ body }: FastifyRequest, reply: FastifyReply) => {
    const ack = await balancePayment.webhook(body);
    const ok = ack?.startsWith(`OK`) === true;
    Log.payment.info(`robokassa.webhook.ack`, { ok, paymentId: ok ? ack.slice(2) : undefined });
    if (ack === undefined) {
      await reply.status(HttpStatus.ok).send();

      return;
    }
    await reply.status(HttpStatus.ok).type(`text/plain`).send(ack);
  };

  if (!ConfigValues.production()) {
    const url = `wss://${ConfigValues.prodHost}${wsPath}`;
    const fields = { url };
    app.post(path, async (request, reply) => {
      Log.payment.info(`robokassa.webhook.dev-handle`, { ip: request.ip, ...hint(request.body) });
      await handle(request, reply);
    });

    return TunnelClient({
      key,
      onClose: () => Log.payment.warn(`tunnel.client.close`, fields),
      onDialError: ({ port, streamId }) => Log.payment.error(`tunnel.client.dial-error`, { ...fields, port, streamId }),
      onOpen: () => Log.payment.info(`tunnel.client.open`, fields),
      url,
    });
  }

  const { online, proxy } = await TunnelHub({
    key,
    onAuthFailed: () => Log.payment.warn(`tunnel.hub.auth-failed`),
    onOffline: () => Log.payment.warn(`tunnel.hub.offline`),
    onReady: ({ port, replaced }) => Log.payment.info(replaced ? `tunnel.hub.replaced` : `tunnel.hub.ready`, { port }),
  }).register(app, wsPath);

  app.post(path, async (request, reply) => {
    const { body, ip } = request;
    if (!RobokassaConfig.allowsIp(ip)) {
      Log.payment.warn(`robokassa.webhook.ip-forbidden`, { ip });
      await reply.status(HttpStatus.forbidden).send();

      return;
    }
    const fields = { ip, path, ...hint(body) };
    if (payment.parseWebhook(body).ok) {
      Log.payment.info(`robokassa.webhook.local`, fields);
      await handle(request, reply);

      return;
    }
    if (online()) {
      Log.payment.info(`robokassa.webhook.proxy`, fields);
      if (!(await proxy(reply, path, { json: body }))) {
        Log.payment.error(`robokassa.webhook.proxy-failed`, fields);
      }

      return;
    }
    Log.payment.warn(`robokassa.webhook.offline-ack`, fields);
    await reply.status(HttpStatus.ok).send();
  });

  return undefined;
};
