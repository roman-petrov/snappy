/* eslint-disable functional/no-expression-statements */
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { Config, ConfigValues } from "@snappy/config";
import { _, HttpStatus } from "@snappy/core";
import { type PaymentProvider, RobokassaConfig } from "@snappy/payment";
import { TunnelClient, TunnelHub } from "@snappy/tunnel";

import type { BalancePayment } from "../BalancePayment";

import { AppLog } from "../AppLog";

export type RobokassaWebhookConfig = { balancePayment: BalancePayment; payment: PaymentProvider };

export const RobokassaWebhook = async (app: FastifyInstance, { balancePayment, payment }: RobokassaWebhookConfig) => {
  const path = `/api/webhooks/robokassa`;
  const wsPath = `/api/tunnel`;
  const key = Config.tunnelKey();
  const log = AppLog();

  const hint = (body: unknown) =>
    !(body instanceof Object) || _.isArray(body)
      ? {}
      : { invId: `InvId` in body ? body.InvId : undefined, outSum: `OutSum` in body ? body.OutSum : undefined };

  const handle = async ({ body }: FastifyRequest, reply: FastifyReply) => {
    const ack = await balancePayment.webhook(body);
    const ok = ack?.startsWith(`OK`) === true;
    log.payment.info(`robokassa.webhook.ack`, { ok, paymentId: ok ? ack.slice(2) : undefined });
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
      log.payment.info(`robokassa.webhook.dev-handle`, { ip: request.ip, ...hint(request.body) });
      await handle(request, reply);
    });

    return TunnelClient({
      key,
      onClose: () => log.payment.warn(`tunnel.client.close`, fields),
      onDialError: ({ port, streamId }) => log.payment.error(`tunnel.client.dial-error`, { ...fields, port, streamId }),
      onOpen: () => log.payment.info(`tunnel.client.open`, fields),
      url,
    });
  }

  const { online, proxy } = await TunnelHub({
    key,
    onAuthFailed: () => log.payment.warn(`tunnel.hub.auth-failed`),
    onOffline: () => log.payment.warn(`tunnel.hub.offline`),
    onReady: ({ port, replaced }) => log.payment.info(replaced ? `tunnel.hub.replaced` : `tunnel.hub.ready`, { port }),
  }).register(app, wsPath);

  app.post(path, async (request, reply) => {
    const { body, ip } = request;
    if (!RobokassaConfig.allowsIp(ip)) {
      log.payment.warn(`robokassa.webhook.ip-forbidden`, { ip });
      await reply.status(HttpStatus.forbidden).send();

      return;
    }
    const fields = { ip, path, ...hint(body) };
    if (payment.parseWebhook(body).ok) {
      log.payment.info(`robokassa.webhook.local`, fields);
      await handle(request, reply);

      return;
    }
    if (online()) {
      log.payment.info(`robokassa.webhook.proxy`, fields);
      if (!(await proxy(reply, path, { json: body }))) {
        log.payment.error(`robokassa.webhook.proxy-failed`, fields);
      }

      return;
    }
    log.payment.warn(`robokassa.webhook.offline-ack`, fields);
    await reply.status(HttpStatus.ok).send();
  });

  return undefined;
};
