import { _, Timer } from "@snappy/core";
import { i } from "@snappy/intl";
import { useAsyncEffectOnce } from "@snappy/ui";
import { useEffect, useState } from "react";

import { api, t } from "../../../core";

export const useLimitState = () => {
  const [nextResetAt, setNextResetAt] = useState<number | undefined>(undefined);
  const [remaining, setRemaining] = useState(0);
  const [freeRequestLimit, setFreeRequestLimit] = useState(0);
  const [premiumPrice, setPremiumPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState(``);

  const remainingMs = (nextReset: number | undefined) =>
    nextReset === undefined ? 0 : Math.max(0, nextReset - _.now());

  useAsyncEffectOnce(async () => {
    const response = await api.remaining(``);
    setNextResetAt(response.nextResetAt);
    setRemaining(remainingMs(response.nextResetAt));
    setFreeRequestLimit(response.freeRequestLimit);
    setPremiumPrice(response.premiumPrice);
    setLoading(false);
  });

  useEffect(
    () => (nextResetAt === undefined ? _.noop : Timer.interval(() => setRemaining(remainingMs(nextResetAt)), _.second)),
    [nextResetAt],
  );

  const countdown = nextResetAt === undefined ? `—` : i.time(remaining, `hms`);

  const subscribe = async () => {
    setPayError(``);
    setPayLoading(true);
    const result = await api.premiumUrl(``);
    setPayLoading(false);
    if (result.status === `ok`) {
      window.location.href = result.url;
    } else {
      setPayError(t(`limit.payError`));
    }
  };

  return { countdown, freeRequestLimit, loading, payError, payLoading, premiumPrice, subscribe };
};
