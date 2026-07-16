/* eslint-disable react/hook-use-state */
/* eslint-disable unicorn/try-complexity */
import { useRouterGo, useRouterQuery } from "@snappy/app-router";
import { _, Timer } from "@snappy/core";
import { useEffectOnce } from "@snappy/ui";
import { useEffect, useRef, useState } from "react";

import { AppConfig } from "../../../AppConfig";
import { useExternalReady } from "../../../components/hooks";
import { r } from "../../../data";
import { Routes } from "../../../Routes";

const { pollEvery, pollFor } = AppConfig.billing;

export const useBillingSuccessState = () => {
  const go = useRouterGo();
  const query = useRouterQuery();
  const paymentId = query.get(`InvId`) ?? ``;
  const outSum = Number(query.get(`OutSum`));

  const [amount, setAmount] = useState<number | undefined>(
    Number.isFinite(outSum) && outSum > 0 ? _.round(outSum, 2) : undefined,
  );

  const [screen, setScreen] = useState<`failed` | `loading` | `succeeded` | `timeout`>(`loading`);
  const [until, setUntil] = useState(0);
  const [, setTick] = useState(0);
  const done = useRef(false);
  const runId = useRef(0);
  const leftSec = Math.max(0, Math.ceil((until - _.now()) / _.second));

  useEffect(
    () =>
      screen !== `loading` || leftSec <= 0 ? undefined : Timer.interval(() => setTick(tick => tick + 1), _.second),
    [leftSec, screen, until],
  );

  const poll = async (id: number, deadline: number) => {
    const alive = () => runId.current === id && !done.current;
    if (paymentId === ``) {
      done.current = true;
      setScreen(`failed`);

      return;
    }
    while (alive()) {
      try {
        const result = await r.billing.paymentStatus({ paymentId });
        if (!alive()) {
          return;
        }
        if (result.status === `pending`) {
          if (result.amount !== undefined) {
            setAmount(result.amount);
          }
          if (_.now() >= deadline) {
            break;
          }
          await Timer.sleep(pollEvery);
          continue;
        }
        if (result.status === `error`) {
          done.current = true;
          setScreen(`failed`);

          return;
        }
        if (result.status === `succeeded`) {
          done.current = true;
          setAmount(result.amount);
          setScreen(`succeeded`);

          return;
        }
        done.current = true;
        setScreen(`failed`);

        return;
      } catch {
        if (!alive()) {
          return;
        }
        if (_.now() >= deadline) {
          break;
        }
        await Timer.sleep(pollEvery);
      }
    }
    if (alive()) {
      setScreen(`timeout`);
    }
  };

  const start = () => {
    done.current = false;
    setScreen(`loading`);
    const deadline = _.now() + pollFor;
    setUntil(deadline);
    runId.current += 1;
    void poll(runId.current, deadline);
  };

  useEffectOnce(() => {
    start();

    return () => {
      runId.current += 1;
    };
  });

  useExternalReady();

  const home = async () => go(Routes.$.home, { instant: true });

  return { amount, home, leftSec, screen, start };
};
