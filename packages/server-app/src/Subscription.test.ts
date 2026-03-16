/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import { _ } from "@snappy/core";
import { describe, expect, it, vi } from "vitest";

import type { PaymentLog } from "./PaymentLog";

import { Subscription } from "./Subscription";
import { Mock } from "./test/Mock";

const mockPaymentLog = (): PaymentLog =>
  ({
    logSubscriptionCancelled: vi.fn(async () => {
      /* Noop for mock */
    }),
    logSubscriptionDeleted: vi.fn(async () => {
      /* Noop for mock */
    }),
  }) as unknown as PaymentLog;

describe(`subscription`, () => {
  const premiumPeriodDays = 30;
  const premiumPrice = 199;

  describe(`get`, () => {
    it(`returns ok with undefined fields when no subscription`, async () => {
      const db = Mock.createDb();
      const paymentLog = mockPaymentLog();
      (db.subscription.findByUserId as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
      const sub = Subscription({
        freeRequestLimit: 10,
        payment: {} as never,
        paymentLog,
        premiumPeriodDays,
        premiumPrice,
        subscription: db.subscription,
      });

      const result = await sub.get(1);

      expect(result).toStrictEqual({
        autoRenew: undefined,
        freeRequestLimit: 10,
        nextBillingAt: undefined,
        premiumPeriodDays: 30,
        premiumPrice: 199,
        premiumUntil: undefined,
        status: `ok`,
      });
      expect(db.subscription.findByUserId).toHaveBeenCalledWith(1);
    });

    it(`returns subscription data when exists`, async () => {
      const db = Mock.createDb();
      const paymentLog = mockPaymentLog();
      const premiumUntil = _.now() + _.day * 10;
      const nextBillingAt = _.now() + _.day * 30;
      (db.subscription.findByUserId as ReturnType<typeof vi.fn>).mockResolvedValue({
        autoRenew: true,
        nextBillingAt,
        premiumUntil,
      });
      const sub = Subscription({
        freeRequestLimit: 10,
        payment: {} as never,
        paymentLog,
        premiumPeriodDays,
        premiumPrice,
        subscription: db.subscription,
      });

      const result = await sub.get(5);

      expect(result).toStrictEqual({
        autoRenew: true,
        freeRequestLimit: 10,
        nextBillingAt,
        premiumPeriodDays: 30,
        premiumPrice: 199,
        premiumUntil,
        status: `ok`,
      });
    });
  });

  describe(`setAutoRenew`, () => {
    it(`sets autoRenew false and logs cancellation`, async () => {
      const db = Mock.createDb();
      const paymentLog = mockPaymentLog();
      (db.subscription.findByUserId as ReturnType<typeof vi.fn>).mockResolvedValue({
        autoRenew: true,
        nextBillingAt: _.now() + _.day,
        premiumUntil: _.now() + _.day,
      });

      const sub = Subscription({
        freeRequestLimit: 10,
        payment: {} as never,
        paymentLog,
        premiumPeriodDays,
        premiumPrice,
        subscription: db.subscription,
      });

      const result = await sub.setAutoRenew(3, false);

      expect(result).toStrictEqual({ status: `ok` });
      expect(db.subscription.setAutoRenew).toHaveBeenCalledWith(3, false);
      expect(paymentLog.logSubscriptionCancelled).toHaveBeenCalledWith(3);
    });
  });

  describe(`renew`, () => {
    it(`returns subscriptionNotFound when subscription is missing`, async () => {
      const db = Mock.createDb();
      const paymentLog = mockPaymentLog();
      (db.subscription.findByUserId as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
      const sub = Subscription({
        freeRequestLimit: 10,
        payment: {} as never,
        paymentLog,
        premiumPeriodDays,
        premiumPrice,
        subscription: db.subscription,
      });

      await expect(sub.renew(7)).resolves.toStrictEqual({ status: `subscriptionNotFound` });
      expect(db.subscription.updatePremiumDates).not.toHaveBeenCalled();
    });

    it(`updates premium dates when subscription exists`, async () => {
      const now = 1_700_000_000_000;
      vi.spyOn(_, `now`).mockReturnValue(now);
      const db = Mock.createDb();
      const paymentLog = mockPaymentLog();
      const premiumUntil = now + _.day;
      (db.subscription.findByUserId as ReturnType<typeof vi.fn>).mockResolvedValue({ premiumUntil });
      const sub = Subscription({
        freeRequestLimit: 10,
        payment: {} as never,
        paymentLog,
        premiumPeriodDays,
        premiumPrice,
        subscription: db.subscription,
      });

      const result = await sub.renew(5);
      const until = premiumUntil + premiumPeriodDays * _.day;

      expect(result).toStrictEqual({ status: `ok` });
      expect(db.subscription.updatePremiumDates).toHaveBeenCalledWith(5, { nextBillingAt: until, premiumUntil: until });
    });
  });

  describe(`delete`, () => {
    it(`returns confirmRequired when confirmLoseTime is false`, async () => {
      const db = Mock.createDb();
      const paymentLog = mockPaymentLog();

      const sub = Subscription({
        freeRequestLimit: 10,
        payment: {} as never,
        paymentLog,
        premiumPeriodDays,
        premiumPrice,
        subscription: db.subscription,
      });

      await expect(sub.delete(8, false)).resolves.toStrictEqual({ status: `confirmRequired` });
      expect(db.subscription.deleteByUserId).not.toHaveBeenCalled();
    });

    it(`returns subscriptionNotFound when nothing was deleted`, async () => {
      const db = Mock.createDb();
      const paymentLog = mockPaymentLog();
      (db.subscription.deleteByUserId as ReturnType<typeof vi.fn>).mockResolvedValue(0);
      const sub = Subscription({
        freeRequestLimit: 10,
        payment: {} as never,
        paymentLog,
        premiumPeriodDays,
        premiumPrice,
        subscription: db.subscription,
      });

      await expect(sub.delete(8, true)).resolves.toStrictEqual({ status: `subscriptionNotFound` });
      expect(paymentLog.logSubscriptionDeleted).not.toHaveBeenCalled();
    });

    it(`deletes subscription and logs event`, async () => {
      const db = Mock.createDb();
      const paymentLog = mockPaymentLog();
      (db.subscription.deleteByUserId as ReturnType<typeof vi.fn>).mockResolvedValue(1);
      const sub = Subscription({
        freeRequestLimit: 10,
        payment: {} as never,
        paymentLog,
        premiumPeriodDays,
        premiumPrice,
        subscription: db.subscription,
      });

      await expect(sub.delete(12, true)).resolves.toStrictEqual({ status: `ok` });
      expect(db.subscription.deleteByUserId).toHaveBeenCalledWith(12);
      expect(paymentLog.logSubscriptionDeleted).toHaveBeenCalledWith(12);
    });
  });

  describe(`hasActiveSubscription`, () => {
    it(`returns false when no subscription`, async () => {
      const db = Mock.createDb();
      const paymentLog = mockPaymentLog();
      (db.subscription.findByUserId as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
      const sub = Subscription({
        freeRequestLimit: 10,
        payment: {} as never,
        paymentLog,
        premiumPeriodDays,
        premiumPrice,
        subscription: db.subscription,
      });

      await expect(sub.hasActiveSubscription(1)).resolves.toBe(false);
    });

    it(`returns false when premiumUntil in the past`, async () => {
      const db = Mock.createDb();
      const paymentLog = mockPaymentLog();
      (db.subscription.findByUserId as ReturnType<typeof vi.fn>).mockResolvedValue({ premiumUntil: _.now() - _.day });
      const sub = Subscription({
        freeRequestLimit: 10,
        payment: {} as never,
        paymentLog,
        premiumPeriodDays,
        premiumPrice,
        subscription: db.subscription,
      });

      await expect(sub.hasActiveSubscription(1)).resolves.toBe(false);
    });

    it(`returns true when premiumUntil in the future`, async () => {
      const db = Mock.createDb();
      const paymentLog = mockPaymentLog();
      (db.subscription.findByUserId as ReturnType<typeof vi.fn>).mockResolvedValue({ premiumUntil: _.now() + _.day });
      const sub = Subscription({
        freeRequestLimit: 10,
        payment: {} as never,
        paymentLog,
        premiumPeriodDays,
        premiumPrice,
        subscription: db.subscription,
      });

      await expect(sub.hasActiveSubscription(1)).resolves.toBe(true);
    });
  });
});
