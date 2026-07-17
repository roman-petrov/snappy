/* eslint-disable functional/no-expression-statements */
import type { Prisma } from "./generated/client";

import { DbCoreConvert } from "./DbCoreConvert";
import { DbCoreLive } from "./DbCoreLive";
import { DbCorePrisma } from "./DbCorePrisma";

export type DbCoreBalance = { balance: number; id: string };

export type DbCoreTopUpLog = { amount?: number | string; currency?: string; paymentId: string; type: string };

export const DbCoreUserBalance = DbCoreLive<DbCoreBalance>()(({ emit, prisma, userId }) => {
  const amount = async () => {
    const row = await prisma.userBalance.findUnique({ select: { amount: true }, where: { userId } });

    return DbCoreConvert.amount(row?.amount);
  };

  const read = async (): Promise<DbCoreBalance> => ({ balance: await amount(), id: userId });

  const applyDelta = async (delta: number, kind: string, amountRubForHistory: number, meta?: Prisma.InputJsonValue) => {
    const balance = await prisma.$transaction(async tx => {
      const row = await tx.userBalance.upsert({
        create: { amount: delta, userId },
        update: { amount: { increment: delta } },
        where: { userId },
      });
      await tx.balanceHistory.create({
        data: { amountRub: amountRubForHistory, balanceAfter: row.amount, kind, meta, userId },
      });

      return DbCoreConvert.amount(row.amount);
    });
    emit({ balance, id: userId });
  };

  const credit = async (amountRub: number, meta?: Prisma.InputJsonValue) =>
    applyDelta(amountRub, `credit`, amountRub, meta);

  const creditTopUp = async (amountRub: number, log: DbCoreTopUpLog) => {
    const credited = await DbCorePrisma.ignoreUnique(
      async () =>
        prisma.$transaction(async tx => {
          const already =
            (await tx.paymentLog.findFirst({ where: { paymentId: log.paymentId, status: `succeeded` } })) !== null;
          if (already) {
            return undefined;
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

          return DbCoreConvert.amount(row.amount);
        }),
      undefined,
    );
    if (credited !== undefined) {
      emit({ balance: credited, id: userId });
    }

    return credited !== undefined;
  };

  const debit = async (amountRub: number, meta?: Prisma.InputJsonValue) =>
    applyDelta(-amountRub, `debit`, amountRub, meta);

  const set = async (amountRub: number) => {
    await prisma.$transaction(async tx => {
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
    const snapshot = { balance: amountRub, id: userId };
    emit(snapshot);

    return snapshot;
  };

  return { credit, creditTopUp, debit, read, set };
});

export type DbCoreUserBalance = ReturnType<typeof DbCoreUserBalance>;
