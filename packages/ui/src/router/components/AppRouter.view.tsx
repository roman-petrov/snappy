import type { ReactNode } from "react";

import type { useAppRouterState } from "./AppRouter.state";

import { RouterContext } from "../RouterContext";

export type AppRouterViewProps = ReturnType<typeof useAppRouterState>;

export const AppRouterView = ({ children, runtime }: AppRouterViewProps): ReactNode => {
  if (runtime === undefined) {
    return children;
  }

  return <RouterContext value={runtime}>{children}</RouterContext>;
};
