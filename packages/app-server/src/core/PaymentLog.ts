import type { Db, DbPaymentLogEntry, DbUser } from "@snappy/db";
import type { PaymentErrorCode, PaymentQueryResult, PaymentSnapshotSuccess } from "@snappy/payment";

export const PaymentLog = (db: ReturnType<typeof Db>) => {
  const failureNote = (code: PaymentErrorCode, externalMessage?: string) =>
    externalMessage === undefined ? code : `${code}: ${externalMessage}`;

  const outcomeNote = (result: PaymentQueryResult) =>
    result.ok ? (result.providerCancellationCode ?? undefined) : failureNote(result.code, result.externalMessage);

  const create = async (user: DbUser | undefined, entry: DbPaymentLogEntry) =>
    user === undefined ? db.paymentLog.create(entry) : user.paymentLog.create(entry);

  const isSucceededAlready = async (paymentId: string) => db.paymentLog.succeeded(paymentId);

  const logTopUpError = async (user: DbUser, code: PaymentErrorCode, externalMessage?: string) =>
    create(user, { currency: `RUB`, errorMessage: failureNote(code, externalMessage), status: `error`, type: `topup` });

  const logTopUpPending = async (user: DbUser, paymentId: string, amount: number | string) =>
    create(user, { amount, currency: `RUB`, status: `pending`, type: `topup`, yooKassaPaymentId: paymentId });

  const logPaymentSucceeded = async (user: DbUser, result: PaymentSnapshotSuccess) =>
    create(user, {
      amount: result.money?.value,
      currency: result.money?.currency,
      paymentMethodId: result.savedMethodId,
      status: `succeeded`,
      type: result.metadataKind ?? `topup`,
      yooKassaPaymentId: result.providerPaymentId,
    });

  const logPaymentNonSucceeded = async (user: DbUser | undefined, result: PaymentSnapshotSuccess) =>
    create(user, {
      amount: result.money?.value,
      currency: result.money?.currency,
      paymentMethodId: result.savedMethodId ?? undefined,
      status: result.status,
      type: result.metadataKind ?? `topup`,
      yooKassaPaymentId: result.providerPaymentId,
    });

  const logPaymentCanceled = async (paymentId: string, result: PaymentQueryResult, user?: DbUser) =>
    create(user, {
      errorMessage: outcomeNote(result),
      paymentMethodId: result.ok ? (result.savedMethodId ?? undefined) : undefined,
      status: result.ok ? `canceled` : `error`,
      type: result.ok ? (result.metadataKind ?? `topup`) : `topup`,
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
