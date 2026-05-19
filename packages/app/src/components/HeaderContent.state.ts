import { useStoreValue } from "@snappy/store";

import { $loggedIn } from "../Store";

export const useHeaderContentState = () => ({ loggedIn: useStoreValue($loggedIn) });
