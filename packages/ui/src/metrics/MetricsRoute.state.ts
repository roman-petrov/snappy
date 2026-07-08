import { RouterContext } from "@snappy/app-router";
import { useRequiredContext } from "@snappy/hooks";
import { useEffect } from "react";

import type { MetricsRouteProps } from "./MetricsRoute";

import { MetricsTracker } from "./MetricsTracker";

export const useMetricsRouteState = ({ metrics, signedIn }: MetricsRouteProps) => {
  const { runtime } = useRequiredContext(RouterContext, `useMetricsRouteState`, `RouterContext`);

  useEffect(() => MetricsTracker.init(metrics, runtime, signedIn), [metrics, runtime, signedIn]);

  return {};
};
