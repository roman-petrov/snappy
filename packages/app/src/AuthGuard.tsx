import type { ReactNode } from "react";

import { useAuthGuardState } from "./AuthGuard.state";
import { AuthGuardView } from "./AuthGuard.view";

export type AuthGuardProps = { children: ReactNode };

export const AuthGuard = (props: AuthGuardProps) => <AuthGuardView {...useAuthGuardState(props)} />;
