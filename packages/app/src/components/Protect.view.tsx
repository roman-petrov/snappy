/* eslint-disable @typescript-eslint/promise-function-async */
import type { ReactNode } from "react";

import { Navigate } from "react-router-dom";

import type { useProtectState } from "./Protect.state";

export type ProtectViewProps = ReturnType<typeof useProtectState> & { children: ReactNode };

export const ProtectView = ({ children, isLoggedIn }: ProtectViewProps) =>
  isLoggedIn ? children : <Navigate replace to="/login" />;
