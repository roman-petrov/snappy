import type { PrismaClient } from "./generated/client";

export type DbPaymentLogEntry = {
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

export const DbPaymentLog = (prisma: PrismaClient) => {
  const create = async (entry: DbPaymentLogEntry) => prisma.paymentLog.create({ data: entry });

  const hasSucceededPayment = async (yooKassaPaymentId: string) =>
    (await prisma.paymentLog.findFirst({ where: { status: `succeeded`, yooKassaPaymentId } })) !== null;

  return { create, hasSucceededPayment };
};
