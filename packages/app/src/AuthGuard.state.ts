import { useStoreValue } from "@snappy/store";
import { useLocation } from "react-router-dom";

import type { AuthGuardProps } from "./AuthGuard";

import { Routes } from "./Routes";
import { $loggedIn } from "./Store";

export const useAuthGuardState = ({ children }: AuthGuardProps) => {
  const publicPaths = new Set([Routes.forgotPassword, Routes.login, Routes.register, Routes.resetPassword]);
  const { pathname } = useLocation();
  const loggedIn = useStoreValue($loggedIn);
  const redirectTo = !publicPaths.has(pathname) && !loggedIn ? Routes.login : undefined;

  return { children, redirectTo };
};
