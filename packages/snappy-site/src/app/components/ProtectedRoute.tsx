import { useProtectedRouteState } from "./ProtectedRoute.state";
import { ProtectedRouteView } from "./ProtectedRoute.view";

export const ProtectedRoute = () => <ProtectedRouteView {...useProtectedRouteState()} />;
