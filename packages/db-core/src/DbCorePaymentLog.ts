import type { PrismaClient } from "./generated/client";

export type DbCorePaymentLogRow = {
  amount?: number | string;
  currency?: string;
  errorMessage?: string;
  idempotenceKey?: string;
  paymentMethodId?: string;
  status: string;
  type: string;
  userId?: string;
  yooKassaPaymentId?: string;
};

export const DbCorePaymentLog = (prisma: PrismaClient) => {
  const create = async (entry: DbCorePaymentLogRow) => prisma.paymentLog.create({ data: entry });

  const succeeded = async (paymentId: string) =>
    (await prisma.paymentLog.findFirst({ where: { status: `succeeded`, yooKassaPaymentId: paymentId } })) !== null;

  return { create, succeeded };
};

export type DbCorePaymentLog = ReturnType<typeof DbCorePaymentLog>;
