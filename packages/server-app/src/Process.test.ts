/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable vitest/prefer-called-with */
import type { Snappy } from "@snappy/snappy";

import { _ } from "@snappy/core";
import { Snappy as SnappyDomain } from "@snappy/domain";
import { describe, expect, it, vi } from "vitest";

import { Process } from "./Process";
import { Mock } from "./test/Mock";

const validOptions = SnappyDomain.defaultOptions;

describe(`process`, () => {
  const freeRequestLimit = 5;
  const premiumPeriodDays = 30;
  const premiumPrice = 199;

  describe(`remaining`, () => {
    it(`returns free tier with remaining count when no subscription and no settings`, async () => {
      const db = Mock.createDb();
      const hasActiveSubscriptionMock = vi.fn().mockResolvedValue(false);
      const snappy: Snappy = { processText: vi.fn().mockResolvedValue(`short text`) } as unknown as Snappy;
      (db.snappySettings.findByUserId as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
      (db.subscription.findByUserId as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
      const process = Process({
        freeRequestLimit,
        hasActiveSubscription: hasActiveSubscriptionMock as (userId: number) => Promise<boolean>,
        premiumPeriodDays,
        premiumPrice,
        snappy,
        snappySettings: db.snappySettings,
        subscription: db.subscription,
      });

      const result = await process.remaining(1);

      expect(result.status).toBe(`ok`);
      expect(result).toMatchObject({ freeRequestLimit: 5, premiumPeriodDays: 30, premiumPrice: 199, remaining: 5 });
      expect(`remaining` in result && result.remaining).toBe(5);
    });

    it(`returns premium tier when subscription active`, async () => {
      const db = Mock.createDb();
      const hasActiveSubscriptionMock = vi.fn().mockResolvedValue(false);
      const snappy: Snappy = { processText: vi.fn().mockResolvedValue(`short text`) } as unknown as Snappy;
      const now = _.now();
      const premiumUntil = now + _.day;
      const nextBillingAt = now + _.day * 30;
      (db.snappySettings.findByUserId as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
      (db.subscription.findByUserId as ReturnType<typeof vi.fn>).mockResolvedValue({
        autoRenew: true,
        nextBillingAt,
        premiumUntil,
      });
      const process = Process({
        freeRequestLimit,
        hasActiveSubscription: hasActiveSubscriptionMock as (userId: number) => Promise<boolean>,
        premiumPeriodDays,
        premiumPrice,
        snappy,
        snappySettings: db.snappySettings,
        subscription: db.subscription,
      });

      const result = await process.remaining(1);

      expect(result.status).toBe(`ok`);
      expect(result).toMatchObject({
        freeRequestLimit: 5,
        isPremium: true,
        nextBillingAt,
        premiumPeriodDays: 30,
        premiumPrice: 199,
        premiumUntil,
        remaining: -1,
      });
    });
  });

  describe(`process`, () => {
    it(`returns requestLimitReached when free limit exceeded and no reset`, async () => {
      const db = Mock.createDb();
      const hasActiveSubscriptionMock = vi.fn().mockResolvedValue(false);
      const snappy: Snappy = { processText: vi.fn().mockResolvedValue(`short text`) } as unknown as Snappy;
      const now = _.now();
      (db.snappySettings.upsertWithReset as ReturnType<typeof vi.fn>).mockResolvedValue({
        lastReset: now,
        requestCount: 5,
        userId: 1,
      });
      const process = Process({
        freeRequestLimit,
        hasActiveSubscription: hasActiveSubscriptionMock as (userId: number) => Promise<boolean>,
        premiumPeriodDays,
        premiumPrice,
        snappy,
        snappySettings: db.snappySettings,
        subscription: db.subscription,
      });

      const result = await process.process(1, { options: validOptions, text: `long text here` });

      expect(result).toStrictEqual({ status: `requestLimitReached` });
      expect(snappy.processText).not.toHaveBeenCalled();
    });

    it(`returns ok and text when under limit`, async () => {
      const db = Mock.createDb();
      const hasActiveSubscriptionMock = vi.fn().mockResolvedValue(false);
      const snappy: Snappy = { processText: vi.fn().mockResolvedValue(`short text`) } as unknown as Snappy;
      const now = _.now();
      (db.snappySettings.upsertWithReset as ReturnType<typeof vi.fn>).mockResolvedValue({
        lastReset: now,
        requestCount: 0,
        userId: 1,
      });
      (db.snappySettings.upsert as ReturnType<typeof vi.fn>).mockResolvedValue({});
      const process = Process({
        freeRequestLimit,
        hasActiveSubscription: hasActiveSubscriptionMock as (userId: number) => Promise<boolean>,
        premiumPeriodDays,
        premiumPrice,
        snappy,
        snappySettings: db.snappySettings,
        subscription: db.subscription,
      });

      const result = await process.process(1, { options: validOptions, text: `  hello  ` });

      expect(result).toStrictEqual({ status: `ok`, text: `short text` });
      expect(snappy.processText).toHaveBeenCalled();
    });
  });
});
