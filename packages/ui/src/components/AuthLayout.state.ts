import { useStoreValue } from "@snappy/store";

import type { AuthLayoutProps } from "./AuthLayout";

import { useRouterPath } from "../router";

export const useAuthLayoutState = ({ children, publicPaths, signedIn, signInPath }: AuthLayoutProps) => {
  const path = useRouterPath();
  const isSignedIn = useStoreValue(signedIn);
  const redirectTo = publicPaths.includes(path) || isSignedIn ? undefined : signInPath;

  return { children, redirectTo };
};
