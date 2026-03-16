/* eslint-disable functional/no-expression-statements */
import type { PrismaClient } from "./generated/client";

import { DbTools } from "./core";

export type DbSubscription = {
  autoRenew: boolean;
  nextBillingAt: number;
  premiumUntil: number;
  userId: number;
  yooKassaPaymentMethodId: string | undefined;
};

const parse = (row: {
  autoRenew: boolean;
  nextBillingAt: Date;
  premiumUntil: Date;
  userId: number;
  yooKassaPaymentMethodId: null | string;
}): DbSubscription => ({
  autoRenew: row.autoRenew,
  nextBillingAt: row.nextBillingAt.getTime(),
  premiumUntil: row.premiumUntil.getTime(),
  userId: row.userId,
  yooKassaPaymentMethodId: row.yooKassaPaymentMethodId ?? undefined,
});

export const DbSubscription = (prisma: PrismaClient) => {
  const findByUserId = async (userId: number) =>
    DbTools.parseNullable(await prisma.subscription.findUnique({ where: { userId } }), parse);

  const setAutoRenew = async (userId: number, autoRenew: boolean) =>
    prisma.subscription.updateMany({ data: { autoRenew }, where: { userId } });

  const updatePremiumDates = async (
    userId: number,
    data: { autoRenew?: boolean; nextBillingAt: number; premiumUntil: number },
  ) =>
    prisma.subscription.update({
      data: {
        nextBillingAt: new Date(data.nextBillingAt),
        premiumUntil: new Date(data.premiumUntil),
        ...(data.autoRenew !== undefined && { autoRenew: data.autoRenew }),
      },
      where: { userId },
    });

  const upsert = async (
    userId: number,
    data: { autoRenew: boolean; nextBillingAt: number; premiumUntil: number; yooKassaPaymentMethodId?: string },
  ) => {
    const nextBillingAt = new Date(data.nextBillingAt);
    const premiumUntil = new Date(data.premiumUntil);

    await prisma.subscription.upsert({
      create: {
        autoRenew: data.autoRenew,
        nextBillingAt,
        premiumUntil,
        userId,
        yooKassaPaymentMethodId: data.yooKassaPaymentMethodId,
      },
      update: {
        autoRenew: data.autoRenew,
        nextBillingAt,
        premiumUntil,
        yooKassaPaymentMethodId: data.yooKassaPaymentMethodId,
      },
      where: { userId },
    });
  };

  const findDueForRenewal = async (before: number) =>
    (
      await prisma.subscription.findMany({
        where: {
          autoRenew: true,
          nextBillingAt: { lte: new Date(before) },
          yooKassaPaymentMethodId: { not: undefined },
        },
      })
    ).map(parse);

  const deleteByUserId = async (userId: number) => (await prisma.subscription.deleteMany({ where: { userId } })).count;

  return { deleteByUserId, findByUserId, findDueForRenewal, setAutoRenew, updatePremiumDates, upsert };
};
