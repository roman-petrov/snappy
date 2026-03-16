import type { Db } from "@snappy/db";
import type {
  PaymentChargeSavedMethodResult,
  PaymentErrorCode,
  PaymentQueryResult,
  PaymentSnapshotSuccess,
} from "@snappy/payment";

const paymentFailureNote = (code: PaymentErrorCode, externalMessage?: string) =>
  externalMessage === undefined ? code : `${code}: ${externalMessage}`;

const paymentOutcomeNote = (result: PaymentChargeSavedMethodResult | PaymentQueryResult) =>
  result.ok ? (result.providerCancellationCode ?? undefined) : paymentFailureNote(result.code, result.externalMessage);

export const PaymentLog = (log: Db[`paymentLog`]) => {
  const isSucceededAlready = async (paymentId: string) => log.hasSucceededPayment(paymentId);

  const logInitialError = async (userId: number, code: PaymentErrorCode, externalMessage?: string) =>
    log.create({
      currency: `RUB`,
      errorMessage: paymentFailureNote(code, externalMessage),
      status: `error`,
      type: `initial`,
      userId,
    });

  const logInitialPending = async (userId: number, paymentId: string, amount: number | string) =>
    log.create({ amount, currency: `RUB`, status: `pending`, type: `initial`, userId, yooKassaPaymentId: paymentId });

  const logPaymentNonSucceeded = async (result: PaymentSnapshotSuccess) =>
    log.create({
      amount: result.money?.value,
      currency: result.money?.currency,
      paymentMethodId: result.savedMethodId ?? undefined,
      status: result.status,
      type: result.metadataKind ?? `initial`,
      userId: result.userId,
      yooKassaPaymentId: result.providerPaymentId,
    });

  const logPaymentSucceeded = async (result: PaymentSnapshotSuccess, userId: number) =>
    log.create({
      amount: result.money?.value,
      currency: result.money?.currency,
      paymentMethodId: result.savedMethodId,
      status: `succeeded`,
      type: result.metadataKind ?? `initial`,
      userId,
      yooKassaPaymentId: result.providerPaymentId,
    });

  const logPaymentCanceled = async (paymentId: string, result: PaymentQueryResult) =>
    log.create({
      errorMessage: paymentOutcomeNote(result),
      paymentMethodId: result.ok ? (result.savedMethodId ?? undefined) : undefined,
      status: result.ok ? `canceled` : `error`,
      type: result.ok ? (result.metadataKind ?? `payment_canceled`) : `payment_canceled`,
      userId: result.ok && result.userId !== undefined && result.userId > 0 ? result.userId : undefined,
      yooKassaPaymentId: paymentId,
    });

  const logRenewal = async (
    result: PaymentChargeSavedMethodResult,
    userId: number,
    amount: number | string,
    idempotenceKey: string,
  ) =>
    log.create({
      amount,
      currency: `RUB`,
      errorMessage: paymentOutcomeNote(result),
      idempotenceKey,
      status: result.ok ? result.status : `failed`,
      type: `renewal`,
      userId,
      yooKassaPaymentId: result.ok ? result.providerPaymentId : undefined,
    });

  const logSubscriptionCancelled = async (userId: number) =>
    log.create({ status: `ok`, type: `subscription_cancelled`, userId });

  const logSubscriptionDeleted = async (userId: number) =>
    log.create({ status: `ok`, type: `subscription_deleted`, userId });

  return {
    isSucceededAlready,
    logInitialError,
    logInitialPending,
    logPaymentCanceled,
    logPaymentNonSucceeded,
    logPaymentSucceeded,
    logRenewal,
    logSubscriptionCancelled,
    logSubscriptionDeleted,
  };
};

export type PaymentLog = ReturnType<typeof PaymentLog>;
