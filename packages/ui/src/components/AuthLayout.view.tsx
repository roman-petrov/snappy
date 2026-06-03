import type { ReactNode } from "react";

import { Navigate, Outlet } from "react-router-dom";

import type { useAuthLayoutState } from "./AuthLayout.state";

import { Layout } from "./Layout";

export type AuthLayoutViewProps = ReturnType<typeof useAuthLayoutState>;

export const AuthLayoutView = ({ header, redirectTo }: AuthLayoutViewProps): ReactNode => (
  <Layout content={redirectTo === undefined ? <Outlet /> : <Navigate replace to={redirectTo} />} trailing={header} />
);
