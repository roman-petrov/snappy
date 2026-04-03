import type { Prisma } from "./generated/client";

export type BalanceHistoryMeta = Prisma.InputJsonValue;

export type BalanceHistoryTx = { balanceHistory: Prisma.BalanceHistoryDelegate };

export const insertBalanceHistory = async (
  tx: BalanceHistoryTx,
  row: {
    amountRub: number | Prisma.Decimal | string;
    balanceAfter: number | Prisma.Decimal | string;
    kind: string;
    meta?: BalanceHistoryMeta;
    userId: number;
  },
) =>
  tx.balanceHistory.create({
    data: {
      amountRub: row.amountRub,
      balanceAfter: row.balanceAfter,
      kind: row.kind,
      meta: row.meta,
      userId: row.userId,
    },
  });
