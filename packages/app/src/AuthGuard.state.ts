import { useStoreValue } from "@snappy/store";
import { useLocation } from "react-router-dom";

import type { AuthGuardProps } from "./AuthGuard";

import { $loggedIn } from "./Store";

export const useAuthGuardState = ({ children }: AuthGuardProps) => {
  const publicPaths = new Set([`/forgot-password`, `/login`, `/register`, `/reset-password`]);
  const { pathname } = useLocation();
  const loggedIn = useStoreValue($loggedIn);
  const redirectTo = !publicPaths.has(pathname) && !loggedIn ? `/login` : undefined;

  return { children, redirectTo };
};
