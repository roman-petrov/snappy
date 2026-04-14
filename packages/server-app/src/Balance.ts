/* eslint-disable functional/no-expression-statements */
import type { BalanceHistoryMeta, Db } from "@snappy/db";

export type BalanceConfig = { balanceMinRub: number; user: Db[`user`] };

export const Balance = ({ balanceMinRub, user: dbUser }: BalanceConfig) => {
  const read = async (userId: string) => dbUser.readBalance(userId);
  const isLlmBlocked = async (userId: string) => (await read(userId)) <= balanceMinRub;

  const creditFromTopUp = async (userId: string, amountRub: number, meta?: BalanceHistoryMeta) =>
    dbUser.creditBalance(userId, amountRub, `credit_payment`, meta);

  const debitForLlm = async (userId: string, rub: number, meta: { call: string; model: string }) => {
    await dbUser.debitBalance(userId, rub, `debit_llm`, { ...meta, chargedRub: rub });
  };

  return { creditFromTopUp, debitForLlm, isLlmBlocked, read };
};

export type Balance = ReturnType<typeof Balance>;
