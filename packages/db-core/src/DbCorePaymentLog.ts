import type { PrismaClient } from "./generated/client";

import { DbCoreConvert } from "./DbCoreConvert";
import { DbCorePrisma } from "./DbCorePrisma";

export type DbCorePaymentLogRow = {
  amount?: number | string;
  currency?: string;
  errorMessage?: string;
  idempotenceKey?: string;
  paymentId?: string;
  status: string;
  type: string;
  userId?: string;
};

export const DbCorePaymentLog = (prisma: PrismaClient) => {
  const create = async (entry: DbCorePaymentLogRow) => prisma.paymentLog.create({ data: entry });

  const createOnce = async (entry: DbCorePaymentLogRow) =>
    DbCorePrisma.ignoreUnique(async () => create(entry), undefined);

  const pendingAmount = async (paymentId: string) => {
    const row = await prisma.paymentLog.findFirst({
      select: { amount: true },
      where: { paymentId, status: `pending` },
    });

    return row === null ? undefined : DbCoreConvert.amount(row.amount);
  };

  const succeeded = async (paymentId: string) =>
    (await prisma.paymentLog.findFirst({ where: { paymentId, status: `succeeded` } })) !== null;

  return { create, createOnce, pendingAmount, succeeded };
};

export type DbCorePaymentLog = ReturnType<typeof DbCorePaymentLog>;
