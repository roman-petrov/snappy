import { useRouterGo, useRouterPath } from "@snappy/app-router";
import { useStoreValue } from "@snappy/store";
import { useEffect } from "react";

import type { AuthLayoutProps } from "./AuthLayout";

export const useAuthLayoutState = ({ children, publicPaths, signedIn, signInPath }: AuthLayoutProps) => {
  const path = useRouterPath();
  const go = useRouterGo();
  const isSignedIn = useStoreValue(signedIn);

  useEffect(() => {
    if (!publicPaths.includes(path) && !isSignedIn) {
      void go(signInPath, { instant: true });
    }
  }, [go, isSignedIn, path, publicPaths, signInPath]);

  return { children };
};
