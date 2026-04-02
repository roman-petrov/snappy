import type { ApiSubscriptionResult } from "@snappy/server-api";

import { _ } from "@snappy/core";
import { useAsyncEffectOnce } from "@snappy/ui";
import { useState } from "react";

import { api } from "../../core";

export type SubscriptionStatus =
  | { autoRenew: false; kind: `premium`; premiumUntil: number }
  | { autoRenew: true; kind: `premium`; nextBillingAt: number; premiumUntil: number }
  | { kind: `free` };

export const useSettingsSubscriptionState = () => {
  const [status, setStatus] = useState<SubscriptionStatus>({ kind: `free` });
  const [subscription, setSubscription] = useState<ApiSubscriptionResult | undefined>(undefined);
  const [error, setError] = useState(``);
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(false);
  const [renewLoading, setRenewLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const refresh = async () => {
    const sub = await api.subscriptionGet();
    setSubscription(sub);
    const now = _.now();
    const { autoRenew, nextBillingAt, premiumUntil } = sub;
    const premiumUntilMs = premiumUntil ?? 0;

    const newStatus: SubscriptionStatus =
      premiumUntilMs <= now || premiumUntil === undefined
        ? { kind: `free` }
        : autoRenew === true && nextBillingAt !== undefined
          ? { autoRenew: true, kind: `premium`, nextBillingAt, premiumUntil }
          : { autoRenew: false, kind: `premium`, premiumUntil };
    setStatus(newStatus);
  };

  useAsyncEffectOnce(refresh);

  const runLoadingAction = async <T>(setLoading: (loading: boolean) => void, action: () => Promise<T>) => {
    setError(``);
    setLoading(true);
    const result = await action();
    setLoading(false);

    return result;
  };

  const runAction = async (setLoading: (loading: boolean) => void, action: () => Promise<{ status: string }>) => {
    const result = await runLoadingAction(setLoading, action);
    if (result.status !== `ok`) {
      setError(`settingsSubscription.errors.${result.status}`);
    }
    await refresh();
  };

  const subscribe = async () => {
    const result = await runLoadingAction(setSubscribeLoading, async () => api.premiumUrl());
    if (result.status === `ok`) {
      window.location.href = result.url;
    } else {
      setError(`limit.payError`);
    }
  };

  const setAutoRenew = async (enabled: boolean) =>
    runAction(setToggleLoading, async () => api.subscriptionSetAutoRenew(enabled));

  const renew = async () => runAction(setRenewLoading, async () => api.subscriptionRenew());
  const deleteSubscription = async () => runAction(setDeleteLoading, async () => api.subscriptionDelete(true));
  const freeRequestLimit = subscription?.freeRequestLimit ?? 0;
  const premiumPrice = subscription?.premiumPrice ?? 0;
  const daysLeft = status.kind === `free` ? 0 : Math.max(0, Math.floor((status.premiumUntil - _.now()) / _.day));

  return {
    daysLeft,
    deleteLoading,
    deleteSubscription,
    error,
    freeRequestLimit,
    premiumPrice,
    renew,
    renewLoading,
    setAutoRenew,
    status,
    subscribe,
    subscribeLoading,
    subscription,
    toggleLoading,
  };
};
