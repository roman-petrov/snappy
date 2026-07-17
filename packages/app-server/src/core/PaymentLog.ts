import type { Db, DbPaymentLogEntry, DbUser } from "@snappy/db";
import type { PaymentErrorCode } from "@snappy/payment";

export const PaymentLog = (db: ReturnType<typeof Db>) => {
  const create = async (user: DbUser | undefined, entry: DbPaymentLogEntry) =>
    user === undefined ? db.paymentLog.create(entry) : user.paymentLog.create(entry);

  const topUpError = async (user: DbUser, code: PaymentErrorCode, externalMessage?: string) =>
    create(user, {
      currency: `RUB`,
      errorMessage: externalMessage === undefined ? code : `${code}: ${externalMessage}`,
      status: `error`,
      type: `topup`,
    });

  const topUpPending = async (user: DbUser, paymentId: string, amount: number | string) =>
    create(user, { amount, currency: `RUB`, paymentId, status: `pending`, type: `topup` });

  const topUpSettleError = async (user: DbUser | undefined, paymentId: string, reason: string) =>
    db.paymentLog.createOnce({
      currency: `RUB`,
      errorMessage: reason,
      paymentId,
      status: `error`,
      type: `topup`,
      userId: user?.id,
    });

  const { pendingAmount, succeeded } = db.paymentLog;

  return { pendingAmount, succeeded, topUpError, topUpPending, topUpSettleError };
};

export type PaymentLog = ReturnType<typeof PaymentLog>;
