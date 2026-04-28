/* eslint-disable functional/no-expression-statements */
import type { PrismaClient } from "./generated/client";

import { type BalanceHistoryMeta, insertBalanceHistory } from "./DbBalanceHistory";

export type UserBalanceCreditKind = `credit_payment`;

export type UserBalanceDebitKind = `debit_llm`;

type UserBalanceLedgerKind = UserBalanceCreditKind | UserBalanceDebitKind;

export const DbUserBalance = (prisma: PrismaClient) => {
  const read = async (userId: string) => {
    const row = await prisma.userBalance.findUnique({ select: { amount: true }, where: { userId } });

    return row === null ? 0 : Number(row.amount);
  };

  const applyDelta = async (
    userId: string,
    delta: number,
    kind: UserBalanceLedgerKind,
    amountRubForHistory: number,
    meta?: BalanceHistoryMeta,
  ) =>
    prisma.$transaction(async tx => {
      const row = await tx.userBalance.upsert({
        create: { amount: delta, userId },
        update: { amount: { increment: delta } },
        where: { userId },
      });
      await insertBalanceHistory(tx, { amountRub: amountRubForHistory, balanceAfter: row.amount, kind, meta, userId });
    });

  const credit = async (userId: string, amountRub: number, kind: UserBalanceCreditKind, meta?: BalanceHistoryMeta) =>
    applyDelta(userId, amountRub, kind, amountRub, meta);

  const debit = async (userId: string, amountRub: number, kind: UserBalanceDebitKind, meta?: BalanceHistoryMeta) =>
    applyDelta(userId, -amountRub, kind, amountRub, meta);

  return { credit, debit, read };
};

export type DbUserBalance = ReturnType<typeof DbUserBalance>;
