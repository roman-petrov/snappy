/* eslint-disable functional/no-expression-statements */
import type { BalanceHistoryMeta, DbUserBalance } from "@snappy/db";

export type BalanceConfig = { balanceMinRub: number; userBalance: DbUserBalance };

export const Balance = ({ balanceMinRub, userBalance }: BalanceConfig) => {
  const read = async (userId: string) => userBalance.read(userId);
  const isLlmBlocked = async (userId: string) => (await read(userId)) <= balanceMinRub;

  const creditFromTopUp = async (userId: string, amountRub: number, meta?: BalanceHistoryMeta) =>
    userBalance.credit(userId, amountRub, `credit_payment`, meta);

  const debitForLlm = async (userId: string, rub: number, meta: { call: string; model: string }) => {
    await userBalance.debit(userId, rub, `debit_llm`, { ...meta, chargedRub: rub });
  };

  return { creditFromTopUp, debitForLlm, isLlmBlocked, read };
};

export type Balance = ReturnType<typeof Balance>;
