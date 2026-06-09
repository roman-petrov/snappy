/* eslint-disable react/hook-use-state */
import { _, Timer } from "@snappy/core";
import { useAsyncSubmit } from "@snappy/ui";
import { useEffect, useState } from "react";

import type { AuthStatus } from "../../../core";

export type UseAuthEmailSendConfig = { onSent?: () => void; request: () => Promise<AuthStatus> };

export const useAuthEmailSend = ({ onSent, request }: UseAuthEmailSendConfig) => {
  const [until, setUntil] = useState(0);
  const [, setTick] = useState(0);
  const cooldownSec = Math.max(0, Math.ceil((until - _.now()) / _.second));

  useEffect(
    () => (cooldownSec <= 0 ? undefined : Timer.interval(() => setTick(tick => tick + 1), _.second)),
    [cooldownSec, until],
  );

  const startCooldown = (seconds = _.minute.seconds) => setUntil(_.now() + seconds * _.second);
  const { error, loading, setError, wrapSubmit } = useAsyncSubmit<string>();

  const onSend = () => {
    void wrapSubmit(async () => {
      const result = await request();
      if (result.status === `tooManyRequests`) {
        startCooldown(result.retryAfterSec);
      }
      if (result.status !== `ok`) {
        setError(result.status);

        return;
      }
      startCooldown();
      onSent?.();
    });
  };

  const send = { cooldownSec, disabled: loading || cooldownSec > 0, error, loading, onSend };

  return { cooldownSec, send, setError, startCooldown };
};
