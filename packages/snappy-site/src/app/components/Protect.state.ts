import { useStoreValue } from "@snappy/store";

import { $loggedIn } from "../Store";

export const useProtectState = () => ({ isLoggedIn: useStoreValue($loggedIn) });
