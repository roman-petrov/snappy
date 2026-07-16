/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import type { PaymentProvider } from "@snappy/payment";

import { describe, expect, it, vi } from "vitest";

import type { Balance } from "./Balance";
import type { PaymentLog } from "./PaymentLog";

import { BalancePayment } from "./BalancePayment";
import { Mock } from "./test/Mock";

const { amount, amountLong, amountRaw, email, max, min, origin, paymentId, production, userId } = vi.hoisted(() => ({
  amount: 42,
  amountLong: `42.000000`,
  amountRaw: `42.00`,
  email: `user@example.com`,
  max: 100,
  min: 10,
  origin: `https://dev.example`,
  paymentId: `pay-1`,
  production: vi.fn(() => false),
  userId: `user-1`,
}));

vi.mock(`@snappy/config`, () => ({
  Config: { balance: { paymentMax: max, paymentMin: min } },
  ConfigValues: { env: () => `dev`, origin: () => origin, production },
}));

vi.mock(`@snappy/log`, () => {
  const channel = () => ({ error: vi.fn(), info: vi.fn(), warn: vi.fn() });
  const root = { ai: channel(), auth: channel(), payment: channel() };

  return { Log: { ...root, withFields: () => root } };
});

const paymentLog = () => ({
  pendingAmount: vi.fn().mockResolvedValue(amount),
  succeeded: vi.fn().mockResolvedValue(false),
  succeededAmount: vi.fn().mockResolvedValue(undefined),
  topUpError: vi.fn().mockResolvedValue(undefined),
  topUpPending: vi.fn().mockResolvedValue(undefined),
  topUpSettleError: vi.fn().mockResolvedValue(undefined),
});

const paymentProvider = () => ({
  createRedirectPayment: vi
    .fn()
    .mockResolvedValue({ ok: true as const, paymentId, redirectUrl: `https://pay.example/redirect` }),
  parseWebhook: vi.fn().mockReturnValue({ ok: true as const, paymentId }),
  payment: vi
    .fn()
    .mockResolvedValue({
      metadataKind: `topup` as const,
      money: { currency: `RUB`, value: amountRaw },
      ok: true as const,
      paymentId,
      status: `succeeded` as const,
      userId,
    }),
});

const setup = () => {
  production.mockReturnValue(false);
  const db = Mock.createDb();
  const user = Mock.createDbUser(userId);
  vi.mocked(db.user).mockImplementation(((id: string) => (id === userId ? user : undefined)) as typeof db.user);
  const log = paymentLog() as unknown as PaymentLog;
  const payment = paymentProvider() as unknown as PaymentProvider;
  const balance = { creditFromTopUp: vi.fn().mockResolvedValue(true) } as unknown as Balance;
  const api = BalancePayment({ balance, db, payment, paymentLog: log });

  return { api, balance, db, log, payment, user };
};

describe(`paymentUrl`, () => {
  it.each([
    { name: `below min`, value: min - 0.01 },
    { name: `above max`, value: max + 0.01 },
    { name: `NaN`, value: Number.NaN },
    { name: `Infinity`, value: Number.POSITIVE_INFINITY },
  ])(`returns invalidAmount when $name`, async ({ value }) => {
    const { api, payment, user } = setup();

    await expect(api.paymentUrl(user, value, `ru`)).resolves.toStrictEqual({ status: `invalidAmount` });
    expect(payment.createRedirectPayment).not.toHaveBeenCalled();
  });

  it(`creates pending payment and returns redirect url in Dev`, async () => {
    const { api, log, payment, user } = setup();
    const rounded = 42.13;

    await expect(api.paymentUrl(user, 42.126, `ru`, email)).resolves.toStrictEqual({
      paymentId,
      status: `ok`,
      url: `https://pay.example/redirect`,
    });

    expect(payment.createRedirectPayment).toHaveBeenCalledWith({
      amount: rounded,
      culture: `ru`,
      description: `Snappy — пополнение баланса`,
      email,
      metadataKind: `topup`,
      options: {
        failUrl: `${origin}/app/billing/robokassa/fail`,
        returnUrl: `${origin}/app/billing/robokassa/success`,
      },
      userId,
    });
    expect(log.topUpPending).toHaveBeenCalledWith(user, paymentId, rounded);
  });

  it(`uses app-prefixed return urls in production`, async () => {
    const { api, payment, user } = setup();
    production.mockReturnValue(true);

    await api.paymentUrl(user, amount, `en`, email);

    expect(payment.createRedirectPayment).toHaveBeenCalledWith(
      expect.objectContaining({
        culture: `en`,
        email,
        options: {
          failUrl: `${origin}/app/billing/robokassa/fail`,
          returnUrl: `${origin}/app/billing/robokassa/success`,
        },
        userId,
      }),
    );
  });

  it(`logs error and returns paymentError when provider fails`, async () => {
    const { api, log, payment, user } = setup();
    vi.mocked(payment.createRedirectPayment).mockResolvedValue({
      code: `provider-error`,
      externalMessage: `down`,
      ok: false,
    });

    await expect(api.paymentUrl(user, amount, `ru`, email)).resolves.toStrictEqual({ status: `paymentError` });
    expect(log.topUpError).toHaveBeenCalledWith(user, `provider-error`, `down`);
    expect(log.topUpPending).not.toHaveBeenCalled();
  });
});

describe(`webhook`, () => {
  it(`returns undefined when webhook payload is invalid`, async () => {
    const { api, payment } = setup();
    vi.mocked(payment.parseWebhook).mockReturnValue({ code: `invalid-webhook-payload`, ok: false });

    await expect(api.webhook({ bad: true })).resolves.toBeUndefined();
    expect(payment.payment).not.toHaveBeenCalled();
  });

  it(`returns undefined when payment snapshot is not succeeded`, async () => {
    const { api, payment } = setup();
    vi.mocked(payment.payment).mockResolvedValue({ code: `network`, ok: false });

    await expect(api.webhook({})).resolves.toBeUndefined();
  });

  it(`returns undefined when payment status is not succeeded`, async () => {
    const { api, payment } = setup();
    vi.mocked(payment.payment).mockResolvedValue({ ok: true, paymentId, status: `pending` });

    await expect(api.webhook({})).resolves.toBeUndefined();
  });

  it(`returns OK when payment already succeeded`, async () => {
    const { api, balance, log } = setup();
    vi.mocked(log.succeeded).mockResolvedValue(true);

    await expect(api.webhook({})).resolves.toBe(`OK${paymentId}`);
    expect(balance.creditFromTopUp).not.toHaveBeenCalled();
    expect(log.topUpSettleError).not.toHaveBeenCalled();
  });

  it(`returns OK and logs settle error for invalid metadata`, async () => {
    const { api, balance, log, payment, user } = setup();
    vi.mocked(payment.payment).mockResolvedValue({
      metadataKind: undefined,
      money: { currency: `RUB`, value: amountRaw },
      ok: true,
      paymentId,
      status: `succeeded`,
      userId,
    });

    await expect(api.webhook({})).resolves.toBe(`OK${paymentId}`);
    expect(log.topUpSettleError).toHaveBeenCalledWith(user, paymentId, `invalid-metadata`);
    expect(balance.creditFromTopUp).not.toHaveBeenCalled();
  });

  it(`returns OK and logs settle error when user is missing`, async () => {
    const { api, log, payment } = setup();
    vi.mocked(payment.payment).mockResolvedValue({
      metadataKind: `topup`,
      money: { currency: `RUB`, value: amountRaw },
      ok: true,
      paymentId,
      status: `succeeded`,
      userId: `missing`,
    });

    await expect(api.webhook({})).resolves.toBe(`OK${paymentId}`);
    expect(log.topUpSettleError).toHaveBeenCalledWith(undefined, paymentId, `missing-user`);
  });

  it.each([
    { name: `non-finite`, value: `nope` },
    { name: `zero`, value: `0` },
    { name: `negative`, value: `-1` },
  ])(`returns OK and logs settle error for invalid amount ($name)`, async ({ value }) => {
    const { api, log, payment, user } = setup();
    vi.mocked(payment.payment).mockResolvedValue({
      metadataKind: `topup`,
      money: { currency: `RUB`, value },
      ok: true,
      paymentId,
      status: `succeeded`,
      userId,
    });

    await expect(api.webhook({})).resolves.toBe(`OK${paymentId}`);
    expect(log.topUpSettleError).toHaveBeenCalledWith(user, paymentId, `invalid-amount`);
  });

  it(`returns OK and logs settle error when pending is missing`, async () => {
    const { api, log, user } = setup();
    vi.mocked(log.pendingAmount).mockResolvedValue(undefined);

    await expect(api.webhook({})).resolves.toBe(`OK${paymentId}`);
    expect(log.topUpSettleError).toHaveBeenCalledWith(user, paymentId, `missing-pending`);
  });

  it(`returns OK and logs settle error when amount mismatches pending`, async () => {
    const { api, log, user } = setup();
    const pending = 7;
    vi.mocked(log.pendingAmount).mockResolvedValue(pending);

    await expect(api.webhook({})).resolves.toBe(`OK${paymentId}`);
    expect(log.topUpSettleError).toHaveBeenCalledWith(user, paymentId, `amount-mismatch:${pending}:${amount}`);
  });

  it(`credits balance and returns OK on success`, async () => {
    const { api, balance, log, payment, user } = setup();
    vi.mocked(payment.payment).mockResolvedValue({
      metadataKind: `topup`,
      money: { currency: `RUB`, value: amountLong },
      ok: true,
      paymentId,
      status: `succeeded`,
      userId,
    });

    await expect(api.webhook({})).resolves.toBe(`OK${paymentId}`);
    expect(balance.creditFromTopUp).toHaveBeenCalledWith(user, amount, {
      amount: amountLong,
      currency: `RUB`,
      paymentId,
    });
    expect(log.topUpSettleError).not.toHaveBeenCalled();
  });

  it(`returns undefined when credit throws`, async () => {
    const { api, balance } = setup();
    vi.mocked(balance.creditFromTopUp).mockRejectedValue(new Error(`db down`));

    await expect(api.webhook({})).resolves.toBeUndefined();
  });
});

describe(`paymentStatus`, () => {
  it(`returns pending when provider is unavailable`, async () => {
    const { api, payment } = setup();
    vi.mocked(payment.payment).mockResolvedValue({ code: `network`, ok: false });

    await expect(api.paymentStatus(userId, paymentId)).resolves.toStrictEqual({ status: `pending` });
  });

  it(`returns error when payment belongs to another user`, async () => {
    const { api, payment } = setup();
    vi.mocked(payment.payment).mockResolvedValue({
      metadataKind: `topup`,
      money: { currency: `RUB`, value: amountRaw },
      ok: true,
      paymentId,
      status: `succeeded`,
      userId: `other`,
    });

    await expect(api.paymentStatus(userId, paymentId)).resolves.toStrictEqual({ status: `error` });
  });

  it(`returns succeeded from payment log without provider lookup`, async () => {
    const { api, log, payment } = setup();
    vi.mocked(log.succeededAmount).mockResolvedValue(amount);

    await expect(api.paymentStatus(userId, paymentId)).resolves.toStrictEqual({ amount, status: `succeeded` });
    expect(payment.payment).not.toHaveBeenCalled();
  });

  it(`returns error when provider succeeded without userId snapshot`, async () => {
    const { api, payment } = setup();
    vi.mocked(payment.payment).mockResolvedValue({
      metadataKind: `topup`,
      money: { currency: `RUB`, value: amountRaw },
      ok: true,
      paymentId,
      status: `succeeded`,
    });

    await expect(api.paymentStatus(userId, paymentId)).resolves.toStrictEqual({ status: `error` });
  });

  it(`returns pending when provider status is not final`, async () => {
    const { api, payment } = setup();
    vi.mocked(payment.payment).mockResolvedValue({ ok: true, paymentId, status: `pending`, userId });

    await expect(api.paymentStatus(userId, paymentId)).resolves.toStrictEqual({ amount: undefined, status: `pending` });
  });

  it(`returns canceled when provider status is canceled`, async () => {
    const { api, payment } = setup();
    vi.mocked(payment.payment).mockResolvedValue({
      money: { currency: `RUB`, value: amountRaw },
      ok: true,
      paymentId,
      status: `canceled`,
      userId,
    });

    await expect(api.paymentStatus(userId, paymentId)).resolves.toStrictEqual({ amount, status: `canceled` });
  });

  it(`returns pending when provider snapshot is incomplete`, async () => {
    const { api, payment } = setup();
    vi.mocked(payment.payment).mockResolvedValue({
      metadataKind: undefined,
      money: { currency: `RUB`, value: amountRaw },
      ok: true,
      paymentId,
      status: `succeeded`,
      userId,
    });

    await expect(api.paymentStatus(userId, paymentId)).resolves.toStrictEqual({ amount, status: `pending` });
  });

  it(`returns error when settle permanently fails`, async () => {
    const { api, log } = setup();
    vi.mocked(log.pendingAmount).mockResolvedValue(undefined);

    await expect(api.paymentStatus(userId, paymentId)).resolves.toStrictEqual({ amount, status: `error` });
  });

  it(`returns pending when credit throws`, async () => {
    const { api, balance } = setup();
    vi.mocked(balance.creditFromTopUp).mockRejectedValue(new Error(`db down`));

    await expect(api.paymentStatus(userId, paymentId)).resolves.toStrictEqual({ amount, status: `pending` });
  });

  it(`settles and returns succeeded`, async () => {
    const { api, balance, log, user } = setup();
    vi.mocked(log.succeededAmount).mockResolvedValueOnce(undefined).mockResolvedValueOnce(amount);
    vi.mocked(log.succeeded).mockResolvedValue(false);

    await expect(api.paymentStatus(userId, paymentId)).resolves.toStrictEqual({ amount, status: `succeeded` });
    expect(balance.creditFromTopUp).toHaveBeenCalledWith(user, amount, {
      amount: amountRaw,
      currency: `RUB`,
      paymentId,
    });
  });
});
