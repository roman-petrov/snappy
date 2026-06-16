import type { ReactNode } from "react";

import type { useAuthLayoutState } from "./AuthLayout.state";

import { Redirect } from "../router";

export type AuthLayoutViewProps = ReturnType<typeof useAuthLayoutState>;

export const AuthLayoutView = ({ children, redirectTo }: AuthLayoutViewProps): ReactNode =>
  redirectTo === undefined ? children : <Redirect to={redirectTo} />;
