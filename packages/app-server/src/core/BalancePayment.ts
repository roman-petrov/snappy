/* eslint-disable unicorn/try-complexity */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-try-statements */
import type { Db, DbUser } from "@snappy/db";
import type { PaymentProvider } from "@snappy/payment";

import { Config, ConfigValues } from "@snappy/config";
import { _ } from "@snappy/core";
import { z } from "zod";

import type { Balance } from "./Balance";
import type { PaymentLog } from "./PaymentLog";

import { RpcScope } from "./RpcContract";
import { Session } from "./Session";

export type BalancePaymentConfig = {
  balance: Balance;
  db: ReturnType<typeof Db>;
  payment: PaymentProvider;
  paymentLog: PaymentLog;
};

export const BalancePayment = ({ balance, db, payment, paymentLog }: BalancePaymentConfig) => {
  const paymentUrl = async (user: DbUser, amount: number) => {
    if (!Number.isFinite(amount) || amount < Config.balance.paymentMinRub || amount > Config.balance.paymentMaxRub) {
      return { status: `invalidAmount` as const };
    }
    const rounded = _.round(amount, 2);
    const origin = ConfigValues.origin(ConfigValues.env());

    const result = await payment.createRedirectPayment({
      amount: rounded,
      description: `Snappy — пополнение баланса`,
      metadataKind: `topup`,
      options: ConfigValues.production()
        ? undefined
        : { failUrl: `${origin}/billing/robokassa/fail`, returnUrl: `${origin}/billing/robokassa/success` },
      userId: user.id,
    });

    if (!result.ok) {
      await paymentLog.topUpError(user, result.code, result.externalMessage);

      return { status: `paymentError` as const };
    }

    await paymentLog.topUpPending(user, result.paymentId, rounded);

    return { status: `ok` as const, url: result.redirectUrl };
  };

  const reject = async (user: DbUser | undefined, paymentId: string, reason: string) => {
    await paymentLog.topUpSettleError(user, paymentId, reason);

    return true;
  };

  const handlePaymentSucceeded = async (paymentId: string) => {
    const result = await payment.payment(paymentId);
    if (!result.ok || result.status !== `succeeded`) {
      return false;
    }
    const { metadataKind, money, userId } = result;

    if (await paymentLog.succeeded(paymentId)) {
      return true;
    }

    const user = Session.dbUserFromId(db, userId);
    if (metadataKind !== `topup`) {
      return reject(user, paymentId, `invalid-metadata`);
    }
    if (user === undefined) {
      return reject(user, paymentId, `missing-user`);
    }

    const amountRub = Number(money?.value);
    if (!Number.isFinite(amountRub) || amountRub <= 0) {
      return reject(user, paymentId, `invalid-amount`);
    }

    const pending = await paymentLog.pendingAmount(paymentId);
    if (pending === undefined) {
      return reject(user, paymentId, `missing-pending`);
    }
    if (_.round(pending, 2) !== _.round(amountRub, 2)) {
      return reject(user, paymentId, `amount-mismatch:${pending}:${amountRub}`);
    }

    try {
      await balance.creditFromTopUp(user, amountRub, { amount: money?.value, currency: money?.currency, paymentId });
    } catch {
      return false;
    }

    return true;
  };

  const webhook = async (body: unknown) => {
    const parsed = payment.parseWebhook(body);

    return !parsed.ok || !(await handlePaymentSucceeded(parsed.paymentId)) ? undefined : `OK${parsed.paymentId}`;
  };

  const rpc = {
    paymentUrl: RpcScope.query(z.object({ amount: z.number().optional() }), async ({ dbUser, input }) =>
      paymentUrl(dbUser, input.amount ?? 0),
    ),
  };

  return { paymentUrl, rpc, webhook };
};

export type BalancePayment = ReturnType<typeof BalancePayment>;
