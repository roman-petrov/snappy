import type { RouterRuntime } from "@snappy/router";
import type { ReactNode } from "react";

import type { RouteLayerOf } from "../RouteOverlay";

import { useAppRouterState } from "./AppRouter.state";
import { AppRouterView } from "./AppRouter.view";

export type AppRouterProps = {
  base?: string;
  children: ReactNode;
  layerOf?: RouteLayerOf;
  path?: string;
  router?: RouterRuntime;
  ssr?: boolean;
};

export const AppRouter = (props: AppRouterProps) => <AppRouterView {...useAppRouterState(props)} />;
