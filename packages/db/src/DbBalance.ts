/* eslint-disable functional/no-expression-statements */
import type { PrismaClient } from "./generated/client";

import { type BalanceHistoryMeta, insertBalanceHistory } from "./DbBalanceHistory";

export type { BalanceHistoryMeta } from "./DbBalanceHistory";

export type BalanceCreditKind = `credit_payment`;

export type BalanceDebitKind = `debit_llm`;

type BalanceLedgerKind = BalanceCreditKind | BalanceDebitKind;

export const DbBalance = (prisma: PrismaClient) => {
  const read = async (userId: number) => {
    const row = await prisma.user.findUnique({ select: { balance: true }, where: { id: userId } });

    return row === null ? 0 : Number(row.balance);
  };

  const applyDelta = async (
    userId: number,
    delta: number,
    kind: BalanceLedgerKind,
    amountRubForHistory: number,
    meta?: BalanceHistoryMeta,
  ) =>
    prisma.$transaction(async tx => {
      await tx.user.update({ data: { balance: { increment: delta } }, where: { id: userId } });
      const row = await tx.user.findUniqueOrThrow({ select: { balance: true }, where: { id: userId } });
      await insertBalanceHistory(tx, { amountRub: amountRubForHistory, balanceAfter: row.balance, kind, meta, userId });
    });

  const credit = async (userId: number, amountRub: number, kind: BalanceCreditKind, meta?: BalanceHistoryMeta) =>
    applyDelta(userId, amountRub, kind, amountRub, meta);

  const debit = async (userId: number, amountRub: number, kind: BalanceDebitKind, meta?: BalanceHistoryMeta) =>
    applyDelta(userId, -amountRub, kind, amountRub, meta);

  return { credit, debit, read };
};

export type DbBalance = ReturnType<typeof DbBalance>;
