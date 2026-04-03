import type { Db } from "@snappy/db";
import type { ApiRemainingResult } from "@snappy/server-api";

import { _ } from "@snappy/core";

export const Limits = ({
  freeRequestLimit,
  premiumPeriodDays,
  premiumPrice,
  snappySettings,
  subscription,
}: {
  freeRequestLimit: number;
  premiumPeriodDays: number;
  premiumPrice: number;
  snappySettings: Db[`snappySettings`];
  subscription: Db[`subscription`];
}) => {
  const resetInterval = _.day;
  const needsReset = (lastReset: number) => _.now() - lastReset > resetInterval;

  const remaining = async (userId: number): Promise<ApiRemainingResult> => {
    const [settings, subRow] = await Promise.all([
      snappySettings.findByUserId(userId),
      subscription.findByUserId(userId),
    ]);

    const now = _.now();
    const isPremium = subRow !== undefined && subRow.premiumUntil > now;

    if (isPremium) {
      return {
        autoRenew: subRow.autoRenew,
        freeRequestLimit,
        isPremium: true,
        nextBillingAt: subRow.nextBillingAt,
        premiumPeriodDays,
        premiumPrice,
        premiumUntil: subRow.premiumUntil,
        remaining: -1,
        status: `ok`,
      };
    }

    const lastReset = settings?.lastReset ?? 0;
    const nextResetAt = lastReset + resetInterval;

    const remainingCount =
      settings === undefined
        ? freeRequestLimit
        : needsReset(settings.lastReset)
          ? freeRequestLimit
          : Math.max(0, freeRequestLimit - settings.requestCount);

    return { freeRequestLimit, nextResetAt, premiumPeriodDays, premiumPrice, remaining: remainingCount, status: `ok` };
  };

  return { remaining };
};

export type Limits = ReturnType<typeof Limits>;
