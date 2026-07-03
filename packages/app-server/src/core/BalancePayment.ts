/* eslint-disable functional/no-expression-statements */
import type { Db, DbUser } from "@snappy/db";
import type { PaymentProvider } from "@snappy/payment";

import { Config } from "@snappy/config";
import { _ } from "@snappy/core";
import { z } from "zod";

import type { PaymentLog } from "./PaymentLog";

import { AppTrpcAuth } from "./AppTrpc";
import { Balance } from "./Balance";
import { Session } from "./Session";

export type BalancePaymentConfig = { db: ReturnType<typeof Db>; payment: PaymentProvider; paymentLog: PaymentLog };

export const BalancePayment = ({ db, payment, paymentLog }: BalancePaymentConfig) => {
  const currency = `RUB`;
  const description = `Snappy — пополнение баланса`;

  const paymentUrl = async (user: DbUser, amount: number) => {
    if (!Number.isFinite(amount) || amount < Config.balance.paymentMinRub || amount > Config.balance.paymentMaxRub) {
      return { status: `invalidAmount` as const };
    }
    const rounded = _.round(amount, 2);

    const result = await payment.createRedirectPayment({
      amount: rounded,
      currency,
      description,
      metadataKind: `topup`,
      userId: user.id,
    });

    if (!result.ok) {
      await paymentLog.logTopUpError(user, result.code, result.externalMessage);

      return { status: `paymentError` as const };
    }

    await paymentLog.logTopUpPending(user, result.providerPaymentId, rounded);

    return { status: `ok` as const, url: result.redirectUrl };
  };

  const handlePaymentSucceeded = async (paymentId: string) => {
    const result = await payment.payment(paymentId);
    if (!result.ok) {
      return;
    }
    if (result.status !== `succeeded`) {
      await paymentLog.logPaymentNonSucceeded(Session.dbUserFromId(db, result.userId), result);

      return;
    }
    if (result.metadataKind !== `topup`) {
      return;
    }

    const already = await paymentLog.isSucceededAlready(paymentId);
    if (already) {
      return;
    }

    const user = Session.dbUserFromId(db, result.userId);
    if (user === undefined) {
      return;
    }

    const { money } = result;
    await paymentLog.logPaymentSucceeded(user, result);

    const value = money?.value;
    const amountRub = value === undefined ? 0 : Number(value);
    if (amountRub > 0) {
      await Balance.creditFromTopUp(user, amountRub, { yooKassaPaymentId: paymentId });
    }
  };

  const handlePaymentCanceled = async (paymentId: string) => {
    const result = await payment.payment(paymentId);

    await paymentLog.logPaymentCanceled(
      paymentId,
      result,
      Session.dbUserFromId(db, result.ok ? result.userId : undefined),
    );
  };

  const webhook = async (body: unknown) => {
    const parsed = payment.parseWebhook(body);
    if (!parsed.ok) {
      return;
    }

    await (parsed.kind === `payment-succeeded` ? handlePaymentSucceeded : handlePaymentCanceled)(
      parsed.providerPaymentId,
    );
  };

  const trpc = {
    paymentUrl: AppTrpcAuth.input(z.object({ amount: z.number().optional() })).mutation(async ({ ctx, input }) =>
      paymentUrl(ctx.dbUser, input.amount ?? 0),
    ),
  };

  return { paymentUrl, trpc, webhook };
};

export type BalancePayment = ReturnType<typeof BalancePayment>;
