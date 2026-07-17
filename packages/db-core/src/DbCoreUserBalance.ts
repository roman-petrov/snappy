/* eslint-disable functional/no-expression-statements */
import type { Prisma, PrismaClient } from "./generated/client";

import { DbCoreConvert } from "./DbCoreConvert";
import { DbCorePrisma } from "./DbCorePrisma";

export type DbCoreTopUpLog = { amount?: number | string; currency?: string; paymentId: string; type: string };

export const DbCoreUserBalance = (prisma: PrismaClient, userId: string) => {
  const read = async () => {
    const row = await prisma.userBalance.findUnique({ select: { amount: true }, where: { userId } });

    return DbCoreConvert.amount(row?.amount);
  };

  const applyDelta = async (delta: number, kind: string, amountRubForHistory: number, meta?: Prisma.InputJsonValue) =>
    prisma.$transaction(async tx => {
      const row = await tx.userBalance.upsert({
        create: { amount: delta, userId },
        update: { amount: { increment: delta } },
        where: { userId },
      });
      await tx.balanceHistory.create({
        data: { amountRub: amountRubForHistory, balanceAfter: row.amount, kind, meta, userId },
      });
    });

  const credit = async (amountRub: number, meta?: Prisma.InputJsonValue) =>
    applyDelta(amountRub, `credit`, amountRub, meta);

  const creditTopUp = async (amountRub: number, log: DbCoreTopUpLog) =>
    DbCorePrisma.ignoreUnique(
      async () =>
        prisma.$transaction(async tx => {
          const already =
            (await tx.paymentLog.findFirst({ where: { paymentId: log.paymentId, status: `succeeded` } })) !== null;
          if (already) {
            return false;
          }

          const row = await tx.userBalance.upsert({
            create: { amount: amountRub, userId },
            update: { amount: { increment: amountRub } },
            where: { userId },
          });
          await tx.balanceHistory.create({
            data: { amountRub, balanceAfter: row.amount, kind: `credit`, meta: { paymentId: log.paymentId }, userId },
          });
          await tx.paymentLog.create({ data: { ...log, status: `succeeded`, userId } });

          return true;
        }),
      false,
    );

  const debit = async (amountRub: number, meta?: Prisma.InputJsonValue) =>
    applyDelta(-amountRub, `debit`, amountRub, meta);

  const set = async (amountRub: number) =>
    prisma.$transaction(async tx => {
      const previous = await tx.userBalance.findUnique({ select: { amount: true }, where: { userId } });
      const previousAmount = DbCoreConvert.amount(previous?.amount);

      const row = await tx.userBalance.upsert({
        create: { amount: amountRub, userId },
        update: { amount: amountRub },
        where: { userId },
      });

      const delta = amountRub - previousAmount;
      if (delta !== 0) {
        await tx.balanceHistory.create({
          data: { amountRub: Math.abs(delta), balanceAfter: row.amount, kind: `set`, userId },
        });
      }
    });

  return { credit, creditTopUp, debit, read, set };
};

export type DbCoreUserBalance = ReturnType<typeof DbCoreUserBalance>;
