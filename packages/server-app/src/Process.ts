/* eslint-disable functional/no-try-statements */
/* eslint-disable functional/no-expression-statements */
import type { Db } from "@snappy/db";
import type { ApiProcessResultUnion, ApiRemainingResult } from "@snappy/server-api";
import type { Snappy } from "@snappy/snappy";

import { _ } from "@snappy/core";
import { Snappy as SnappyDomain, type SnappyOptions } from "@snappy/domain";
import { SnappyCore } from "@snappy/snappy-core";

export const Process = ({
  freeRequestLimit,
  hasActiveSubscription,
  premiumPeriodDays,
  premiumPrice,
  snappy,
  snappySettings,
  subscription,
}: {
  freeRequestLimit: number;
  hasActiveSubscription: (userId: number) => Promise<boolean>;
  premiumPeriodDays: number;
  premiumPrice: number;
  snappy: Snappy;
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

    const options = settings ?? SnappyDomain.defaultOptions;
    const now = _.now();
    const isPremium = subRow !== undefined && subRow.premiumUntil > now;

    if (isPremium) {
      return {
        autoRenew: subRow.autoRenew,
        freeRequestLimit,
        isPremium: true,
        nextBillingAt: subRow.nextBillingAt,
        options,
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

    return {
      freeRequestLimit,
      nextResetAt,
      options,
      premiumPeriodDays,
      premiumPrice,
      remaining: remainingCount,
      status: `ok`,
    };
  };

  const process = async (
    userId: number,
    body: { options: SnappyOptions; text: string },
  ): Promise<ApiProcessResultUnion> => {
    const { options, text } = body;
    const premium = await hasActiveSubscription(userId);
    const now = _.now();
    const settings = await snappySettings.upsertWithReset(userId, now, 0);
    const reset = needsReset(settings.lastReset);
    if (reset) {
      await snappySettings.resetCounter(userId, now);
    }
    if (!premium && !reset && settings.requestCount >= freeRequestLimit) {
      return { status: `requestLimitReached` };
    }

    try {
      const value = await snappy.processText(text.trim(), SnappyCore.generateSystemPrompt(options));

      await snappySettings.upsert(userId, {
        incrementOnUpdate: !premium,
        lastReset: now,
        options,
        requestCount: premium ? 0 : 1,
      });

      return { status: `ok`, text: value };
    } catch {
      return { status: `processingFailed` };
    }
  };

  return { process, remaining };
};

export type Process = ReturnType<typeof Process>;
