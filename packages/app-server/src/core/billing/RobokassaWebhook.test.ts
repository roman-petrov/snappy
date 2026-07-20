/* @vitest-environment node */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import type { PaymentProvider } from "@snappy/payment";

import { HttpStatus } from "@snappy/core";
import fastifyFactory from "fastify";
import { describe, expect, it, vi } from "vitest";

import type { BalancePayment } from "../BalancePayment";

import { RobokassaWebhook } from "./RobokassaWebhook";

const { allowsIp, production } = vi.hoisted(() => ({ allowsIp: vi.fn(() => true), production: vi.fn(() => true) }));

vi.mock(`@snappy/config`, () => ({
  Config: { tunnelKey: () => `k` },
  ConfigValues: { prodHost: `prod.example`, production },
}));

vi.mock(`@snappy/log`, () => {
  const channel = () => ({ error: vi.fn(), info: vi.fn(), warn: vi.fn() });

  return { Log: { ai: channel(), auth: channel(), payment: channel() } };
});

vi.mock(`@snappy/payment`, () => ({ RobokassaConfig: { allowsIp } }));

const payment = (ok: boolean): PaymentProvider =>
  ({
    parseWebhook: vi.fn(() =>
      ok ? { ok: true as const, paymentId: `1` } : { code: `invalid-webhook-payload` as const, ok: false as const },
    ),
  }) as unknown as PaymentProvider;

const balancePayment = (body: string | undefined = `OK1`): BalancePayment =>
  ({ webhook: vi.fn().mockResolvedValue(body) }) as unknown as BalancePayment;

const hub = async (ok = true) => {
  production.mockReturnValue(true);
  allowsIp.mockReturnValue(true);
  const app = fastifyFactory();
  await RobokassaWebhook(app, { balancePayment: balancePayment(), payment: payment(ok) });
  await app.ready();

  return app;
};

describe(`RobokassaWebhook`, () => {
  it(`handles locally in Dev`, async () => {
    production.mockReturnValue(false);
    allowsIp.mockReturnValue(true);
    const app = fastifyFactory();
    const client = await RobokassaWebhook(app, { balancePayment: balancePayment(), payment: payment(true) });
    await app.ready();

    const response = await app.inject({ method: `POST`, payload: { a: 1 }, url: `/api/webhooks/robokassa` });

    expect(response.statusCode).toBe(HttpStatus.ok);
    expect(response.body).toBe(`OK1`);

    client?.stop();
    await app.close();
  });

  it(`handles locally on hub when signature is valid`, async () => {
    const app = await hub(true);
    const response = await app.inject({ method: `POST`, payload: { a: 1 }, url: `/api/webhooks/robokassa` });

    expect(response.statusCode).toBe(HttpStatus.ok);
    expect(response.body).toBe(`OK1`);

    await app.close();
  });

  it(`returns empty ok on hub when signature is invalid and tunnel is offline`, async () => {
    const app = await hub(false);
    const response = await app.inject({ method: `POST`, payload: { a: 1 }, url: `/api/webhooks/robokassa` });

    expect(response.statusCode).toBe(HttpStatus.ok);
    expect(response.body).toBe(``);

    await app.close();
  });

  it(`rejects unauthorized IPs on hub`, async () => {
    production.mockReturnValue(true);
    allowsIp.mockReturnValue(false);
    const app = fastifyFactory();
    await RobokassaWebhook(app, { balancePayment: balancePayment(), payment: payment(true) });
    await app.ready();

    const response = await app.inject({ method: `POST`, url: `/api/webhooks/robokassa` });

    expect(response.statusCode).toBe(HttpStatus.forbidden);

    await app.close();
  });
});
