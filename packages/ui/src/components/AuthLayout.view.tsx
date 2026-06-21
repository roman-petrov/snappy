import type { ReactNode } from "react";

import type { useAuthLayoutState } from "./AuthLayout.state";

export type AuthLayoutViewProps = ReturnType<typeof useAuthLayoutState>;

export const AuthLayoutView = ({ children }: AuthLayoutViewProps): ReactNode => children;
