import { RouterSsr } from "@snappy/router";
import { useEffect, useMemo } from "react";

import type { AppRouterProps } from "./AppRouter";

import { RouteMotion } from "../core";

export const useAppRouterState = ({ base = ``, children, layerOf, path, router, ssr = false }: AppRouterProps) => {
  const shell = useMemo(
    () => (ssr && router === undefined ? RouterSsr({ base, path, ssr: true }).router : undefined),
    [base, path, router, ssr],
  );

  const runtime = router ?? shell;
  const transition = useMemo(() => (layerOf === undefined ? undefined : RouteMotion.transition(layerOf)), [layerOf]);

  if (runtime !== undefined) {
    runtime.init({ base, path, ssr, transition });
  }

  useEffect(() => {
    if (!ssr && runtime !== undefined) {
      return runtime.dispose;
    }

    return undefined;
  }, [runtime, ssr]);

  return { children, layerOf, runtime };
};
