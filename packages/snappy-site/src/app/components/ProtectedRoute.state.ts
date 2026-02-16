import { useStoreValue } from "@snappy/store";

import { $loggedIn } from "../Store";

export const useProtectedRouteState = () => ({ isLoggedIn: useStoreValue($loggedIn) });
