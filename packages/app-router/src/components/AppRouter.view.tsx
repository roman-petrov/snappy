import type { ReactNode } from "react";

import type { useAppRouterState } from "./AppRouter.state";

import { RouterContext } from "../core";

export type AppRouterViewProps = ReturnType<typeof useAppRouterState>;

export const AppRouterView = ({ children, layerOf, runtime }: AppRouterViewProps): ReactNode =>
  runtime === undefined ? children : <RouterContext value={{ layerOf, runtime }}>{children}</RouterContext>;
