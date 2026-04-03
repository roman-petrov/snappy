import type { Db } from "@snappy/db";
import type { PaymentErrorCode, PaymentQueryResult, PaymentSnapshotSuccess } from "@snappy/payment";

const paymentFailureNote = (code: PaymentErrorCode, externalMessage?: string) =>
  externalMessage === undefined ? code : `${code}: ${externalMessage}`;

const paymentOutcomeNote = (result: PaymentQueryResult) =>
  result.ok ? (result.providerCancellationCode ?? undefined) : paymentFailureNote(result.code, result.externalMessage);

export const PaymentLog = (log: Db[`paymentLog`]) => {
  const isSucceededAlready = async (paymentId: string) => log.hasSucceededPayment(paymentId);

  const logTopUpError = async (userId: number, code: PaymentErrorCode, externalMessage?: string) =>
    log.create({
      currency: `RUB`,
      errorMessage: paymentFailureNote(code, externalMessage),
      status: `error`,
      type: `topup`,
      userId,
    });

  const logTopUpPending = async (userId: number, paymentId: string, amount: number | string) =>
    log.create({ amount, currency: `RUB`, status: `pending`, type: `topup`, userId, yooKassaPaymentId: paymentId });

  const logPaymentNonSucceeded = async (result: PaymentSnapshotSuccess) =>
    log.create({
      amount: result.money?.value,
      currency: result.money?.currency,
      paymentMethodId: result.savedMethodId ?? undefined,
      status: result.status,
      type: result.metadataKind ?? `topup`,
      userId: result.userId,
      yooKassaPaymentId: result.providerPaymentId,
    });

  const logPaymentSucceeded = async (result: PaymentSnapshotSuccess, userId: number) =>
    log.create({
      amount: result.money?.value,
      currency: result.money?.currency,
      paymentMethodId: result.savedMethodId,
      status: `succeeded`,
      type: result.metadataKind ?? `topup`,
      userId,
      yooKassaPaymentId: result.providerPaymentId,
    });

  const logPaymentCanceled = async (paymentId: string, result: PaymentQueryResult) =>
    log.create({
      errorMessage: paymentOutcomeNote(result),
      paymentMethodId: result.ok ? (result.savedMethodId ?? undefined) : undefined,
      status: result.ok ? `canceled` : `error`,
      type: result.ok ? (result.metadataKind ?? `topup`) : `topup`,
      userId: result.ok && result.userId !== undefined && result.userId > 0 ? result.userId : undefined,
      yooKassaPaymentId: paymentId,
    });

  return {
    isSucceededAlready,
    logPaymentCanceled,
    logPaymentNonSucceeded,
    logPaymentSucceeded,
    logTopUpError,
    logTopUpPending,
  };
};

export type PaymentLog = ReturnType<typeof PaymentLog>;
