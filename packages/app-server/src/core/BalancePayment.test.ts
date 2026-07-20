/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import type { PaymentProvider } from "@snappy/payment";

import { describe, expect, it, vi } from "vitest";

import type { Balance } from "./Balance";
import type { PaymentLog } from "./PaymentLog";

import { BalancePayment } from "./BalancePayment";
import { Mock } from "./test/Mock";

const production = vi.hoisted(() => vi.fn(() => false));

vi.mock(`@snappy/config`, () => ({
  Config: { balance: { paymentMaxRub: 5000, paymentMinRub: 10, signUpBonusRub: 50 } },
  ConfigValues: { env: () => `dev`, origin: () => `https://dev.example`, production },
}));

vi.mock(`@snappy/log`, () => {
  const channel = () => ({ error: vi.fn(), info: vi.fn(), warn: vi.fn() });
  const root = { ai: channel(), auth: channel(), payment: channel() };

  return { Log: { ...root, withFields: () => root } };
});

const paymentId = `pay-1`;
const userId = `user-1`;

const paymentLog = () => ({
  pendingAmount: vi.fn().mockResolvedValue(100),
  succeeded: vi.fn().mockResolvedValue(false),
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
      money: { currency: `RUB`, value: `100.00` },
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
    { amount: 9.99, name: `below min` },
    { amount: 5000.01, name: `above max` },
    { amount: Number.NaN, name: `NaN` },
    { amount: Number.POSITIVE_INFINITY, name: `Infinity` },
  ])(`returns invalidAmount when $name`, async ({ amount }) => {
    const { api, payment, user } = setup();

    await expect(api.paymentUrl(user, amount)).resolves.toStrictEqual({ status: `invalidAmount` });
    expect(payment.createRedirectPayment).not.toHaveBeenCalled();
  });

  it(`creates pending payment and returns redirect url in Dev`, async () => {
    const { api, log, payment, user } = setup();

    await expect(api.paymentUrl(user, 100.126)).resolves.toStrictEqual({
      status: `ok`,
      url: `https://pay.example/redirect`,
    });

    expect(payment.createRedirectPayment).toHaveBeenCalledWith({
      amount: 100.13,
      description: `Snappy — пополнение баланса`,
      metadataKind: `topup`,
      options: {
        failUrl: `https://dev.example/billing/robokassa/fail`,
        returnUrl: `https://dev.example/billing/robokassa/success`,
      },
      userId,
    });
    expect(log.topUpPending).toHaveBeenCalledWith(user, paymentId, 100.13);
  });

  it(`omits return urls in production`, async () => {
    const { api, payment, user } = setup();
    production.mockReturnValue(true);

    await api.paymentUrl(user, 50);

    expect(payment.createRedirectPayment).toHaveBeenCalledWith(expect.objectContaining({ options: undefined, userId }));
  });

  it(`logs error and returns paymentError when provider fails`, async () => {
    const { api, log, payment, user } = setup();
    vi.mocked(payment.createRedirectPayment).mockResolvedValue({
      code: `provider-error`,
      externalMessage: `down`,
      ok: false,
    });

    await expect(api.paymentUrl(user, 50)).resolves.toStrictEqual({ status: `paymentError` });
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
      money: { currency: `RUB`, value: `100.00` },
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
      money: { currency: `RUB`, value: `100.00` },
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
    vi.mocked(log.pendingAmount).mockResolvedValue(50);

    await expect(api.webhook({})).resolves.toBe(`OK${paymentId}`);
    expect(log.topUpSettleError).toHaveBeenCalledWith(user, paymentId, `amount-mismatch:50:100`);
  });

  it(`credits balance and returns OK on success`, async () => {
    const { api, balance, log, payment, user } = setup();
    vi.mocked(payment.payment).mockResolvedValue({
      metadataKind: `topup`,
      money: { currency: `RUB`, value: `100.000000` },
      ok: true,
      paymentId,
      status: `succeeded`,
      userId,
    });

    await expect(api.webhook({})).resolves.toBe(`OK${paymentId}`);
    expect(balance.creditFromTopUp).toHaveBeenCalledWith(user, 100, {
      amount: `100.000000`,
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
