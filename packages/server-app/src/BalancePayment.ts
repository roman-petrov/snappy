/* eslint-disable functional/no-expression-statements */
import type { PaymentProvider } from "@snappy/payment";

import { _ } from "@snappy/core";
import { z } from "zod";

import type { Balance } from "./Balance";
import type { PaymentLog } from "./PaymentLog";

import { TrpcAuth } from "./Trpc";

export const BalancePayment = ({
  balance,
  balancePaymentMaxRub,
  balancePaymentMinRub,
  payment,
  paymentLog,
}: {
  balance: Balance;
  balancePaymentMaxRub: number;
  balancePaymentMinRub: number;
  payment: PaymentProvider;
  paymentLog: PaymentLog;
}) => {
  const currency = `RUB`;
  const description = `Snappy — пополнение баланса`;

  const paymentUrl = async (userId: string, amount: number) => {
    if (!Number.isFinite(amount) || amount < balancePaymentMinRub || amount > balancePaymentMaxRub) {
      return { status: `invalidAmount` as const };
    }
    const rounded = _.round(amount, 2);

    const result = await payment.createRedirectPayment({
      amount: rounded,
      currency,
      description,
      metadataKind: `topup`,
      userId,
    });

    if (!result.ok) {
      await paymentLog.logTopUpError(userId, result.code, result.externalMessage);

      return { status: `paymentError` as const };
    }

    await paymentLog.logTopUpPending(userId, result.providerPaymentId, rounded);

    return { status: `ok` as const, url: result.redirectUrl };
  };

  const handlePaymentSucceeded = async (paymentId: string) => {
    const result = await payment.payment(paymentId);
    if (!result.ok) {
      return;
    }
    if (result.status !== `succeeded`) {
      await paymentLog.logPaymentNonSucceeded(result);

      return;
    }
    if (result.metadataKind !== `topup`) {
      return;
    }

    const already = await paymentLog.isSucceededAlready(paymentId);
    if (already) {
      return;
    }

    const { money, userId } = result;
    if (userId === undefined || userId === ``) {
      return;
    }

    await paymentLog.logPaymentSucceeded(result, userId);

    const value = money?.value;
    const amountRub = value === undefined ? 0 : Number(value);
    if (amountRub > 0) {
      await balance.creditFromTopUp(userId, amountRub, { yooKassaPaymentId: paymentId });
    }
  };

  const handlePaymentCanceled = async (paymentId: string) =>
    paymentLog.logPaymentCanceled(paymentId, await payment.payment(paymentId));

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
    paymentUrl: TrpcAuth.input(z.object({ amount: z.number().optional() })).mutation(async ({ ctx, input }) =>
      paymentUrl(ctx.userId, input.amount ?? 0),
    ),
  };

  return { trpc, webhook };
};

export type BalancePayment = ReturnType<typeof BalancePayment>;
