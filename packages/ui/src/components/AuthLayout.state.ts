import { useStoreValue } from "@snappy/store";
import { useLocation } from "react-router-dom";

import type { AuthLayoutProps } from "./AuthLayout";

export const useAuthLayoutState = ({ header, publicPaths, signedIn, signInPath }: AuthLayoutProps) => {
  const { pathname } = useLocation();
  const isSignedIn = useStoreValue(signedIn);
  const redirectTo = publicPaths.includes(pathname) || isSignedIn ? undefined : signInPath;

  return { header, redirectTo };
};
