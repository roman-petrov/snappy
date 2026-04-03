/* eslint-disable functional/no-expression-statements */
import type { BalanceHistoryMeta, Db } from "@snappy/db";

export const Balance = ({ balance: dbBalance, balanceMinRub }: { balance: Db[`balance`]; balanceMinRub: number }) => {
  const read = async (userId: number) => dbBalance.read(userId);
  const isLlmBlocked = async (userId: number) => (await read(userId)) <= balanceMinRub;

  const creditFromTopUp = async (userId: number, amountRub: number, meta?: BalanceHistoryMeta) =>
    dbBalance.credit(userId, amountRub, `credit_payment`, meta);

  const debitForLlm = async (userId: number, rub: number, meta: { call: string; model: string }) => {
    await dbBalance.debit(userId, rub, `debit_llm`, { ...meta, chargedRub: rub });
  };

  return { creditFromTopUp, debitForLlm, isLlmBlocked, read };
};

export type Balance = ReturnType<typeof Balance>;
