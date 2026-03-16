/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-loop-statements */

import type { Db } from "@snappy/db";
import type { PaymentProvider } from "@snappy/payment";

import { _ } from "@snappy/core";

import type { PaymentLog } from "./PaymentLog";

export const Subscription = ({
  freeRequestLimit,
  payment,
  paymentLog,
  premiumPeriodDays,
  premiumPrice,
  subscription,
}: {
  freeRequestLimit: number;
  payment: PaymentProvider;
  paymentLog: PaymentLog;
  premiumPeriodDays: number;
  premiumPrice: number;
  subscription: Db[`subscription`];
}) => {
  const premiumPeriod = premiumPeriodDays * _.day;
  const initialPaymentDescription = `Snappy Premium — подписка`;
  const renewalPaymentDescription = `Snappy Premium — продление подписки`;
  const currency = `RUB`;

  const get = async (userId: number) => {
    const sub = await subscription.findByUserId(userId);

    return {
      autoRenew: sub?.autoRenew,
      freeRequestLimit,
      nextBillingAt: sub?.nextBillingAt,
      premiumPeriodDays,
      premiumPrice,
      premiumUntil: sub?.premiumUntil,
      status: `ok`,
    };
  };

  const withSubscription = async (
    userId: number,
    callback: (sub: NonNullable<Awaited<ReturnType<typeof subscription.findByUserId>>>) => Promise<void>,
  ): Promise<{ status: `ok` } | { status: `subscriptionNotFound` }> => {
    const sub = await subscription.findByUserId(userId);
    if (sub === undefined) {
      return { status: `subscriptionNotFound` };
    }
    await callback(sub);

    return { status: `ok` };
  };

  const setAutoRenew = async (
    userId: number,
    enabled: boolean,
  ): Promise<{ status: `ok` } | { status: `subscriptionNotFound` }> =>
    withSubscription(userId, async () => {
      await subscription.setAutoRenew(userId, enabled);
      if (!enabled) {
        await paymentLog.logSubscriptionCancelled(userId);
      }
    });

  const renew = async (userId: number): Promise<{ status: `ok` } | { status: `subscriptionNotFound` }> =>
    withSubscription(userId, async sub => {
      const until = Math.max(_.now(), sub.premiumUntil) + premiumPeriod;
      await subscription.updatePremiumDates(userId, { nextBillingAt: until, premiumUntil: until });
    });

  const $delete = async (
    userId: number,
    confirmLoseTime: boolean,
  ): Promise<{ status: `confirmRequired` | `ok` | `subscriptionNotFound` }> => {
    if (!confirmLoseTime) {
      return { status: `confirmRequired` };
    }
    const deleted = await subscription.deleteByUserId(userId);
    if (deleted === 0) {
      return { status: `subscriptionNotFound` };
    }
    await paymentLog.logSubscriptionDeleted(userId);

    return { status: `ok` };
  };

  const hasActiveSubscription = async (userId: number) => {
    const sub = await subscription.findByUserId(userId);

    return sub !== undefined && sub.premiumUntil > _.now();
  };

  const paymentUrl = async (userId: number) => {
    const result = await payment.createRedirectPayment({
      amount: premiumPrice,
      currency,
      description: initialPaymentDescription,
      options: { savePaymentMethod: true },
      userId,
    });

    if (!result.ok) {
      await paymentLog.logInitialError(userId, result.code, result.externalMessage);

      return { status: `paymentError` };
    }

    const { providerPaymentId, redirectUrl } = result;

    await paymentLog.logInitialPending(userId, providerPaymentId, premiumPrice);

    return { status: `ok`, url: redirectUrl };
  };

  const handlePaymentSucceeded = async (paymentId: string) => {
    const result = await payment.payment(paymentId);
    if (!result.ok) {
      return;
    }
    if (result.status !== `succeeded`) {
      await paymentLog.logPaymentNonSucceeded(result);

      return;
    }

    const already = await paymentLog.isSucceededAlready(paymentId);
    if (already) {
      return;
    }

    const { userId } = result;
    if (userId === undefined || userId <= 0) {
      return;
    }

    await paymentLog.logPaymentSucceeded(result, userId);

    const { savedMethodId } = result;
    const sub = await subscription.findByUserId(userId);
    const until = _.now() + premiumPeriod;

    if (
      sub !== undefined &&
      savedMethodId !== undefined &&
      savedMethodId !== `` &&
      sub.yooKassaPaymentMethodId === savedMethodId
    ) {
      await subscription.updatePremiumDates(userId, { nextBillingAt: until, premiumUntil: until });
    } else if (savedMethodId !== undefined && savedMethodId !== ``) {
      await subscription.upsert(userId, {
        autoRenew: true,
        nextBillingAt: until,
        premiumUntil: until,
        yooKassaPaymentMethodId: savedMethodId,
      });
    }
  };

  const handlePaymentCanceled = async (paymentId: string) =>
    paymentLog.logPaymentCanceled(paymentId, await payment.payment(paymentId));

  const webhook = async (body: unknown) => {
    const parsed = payment.parseWebhook(body);
    if (!parsed.ok) {
      return { status: `ok` };
    }

    await (parsed.kind === `payment-succeeded` ? handlePaymentSucceeded : handlePaymentCanceled)(
      parsed.providerPaymentId,
    );

    return { status: `ok` };
  };

  const renewAll = async () => {
    const now = _.now();
    const list = await subscription.findDueForRenewal(now);

    for (const sub of list) {
      const methodId = sub.yooKassaPaymentMethodId;
      if (methodId === undefined || methodId === ``) {
        continue;
      }

      const idempotenceKey = `renewal-${sub.userId}-${sub.nextBillingAt}`;

      const result = await payment.chargeSavedMethod({
        amount: premiumPrice,
        currency,
        description: renewalPaymentDescription,
        idempotenceKey,
        savedMethodId: methodId,
        userId: sub.userId,
      });

      await paymentLog.logRenewal(result, sub.userId, premiumPrice, idempotenceKey);

      if (result.ok && result.status === `succeeded`) {
        const until = _.now() + premiumPeriod;
        await subscription.updatePremiumDates(sub.userId, { nextBillingAt: until, premiumUntil: until });
      }
    }
  };

  return {
    delete: $delete,
    get,
    handlePaymentCanceled,
    handlePaymentSucceeded,
    hasActiveSubscription,
    paymentUrl,
    renew,
    renewAll,
    setAutoRenew,
    webhook,
  };
};

export type Subscription = ReturnType<typeof Subscription>;
