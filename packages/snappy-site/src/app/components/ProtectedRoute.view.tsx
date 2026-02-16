import { Navigate } from "react-router-dom";

import type { useProtectedRouteState } from "./ProtectedRoute.state";

import { Dashboard } from "./Dashboard";

export type ProtectedRouteViewProps = ReturnType<typeof useProtectedRouteState>;

export const ProtectedRouteView = ({ isLoggedIn }: ProtectedRouteViewProps) =>
  isLoggedIn ? <Dashboard /> : <Navigate replace to="/login" />;
