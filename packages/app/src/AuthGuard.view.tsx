import type { ReactNode } from "react";

import { Navigate } from "react-router-dom";

import type { useAuthGuardState } from "./AuthGuard.state";

export type AuthGuardViewProps = ReturnType<typeof useAuthGuardState>;

export const AuthGuardView = ({ children, redirectTo }: AuthGuardViewProps): ReactNode =>
  redirectTo === undefined ? children : <Navigate replace to={redirectTo} />;
