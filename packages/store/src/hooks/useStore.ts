import type { Store } from "@snappy/core";

import { useSyncExternalStore } from "react";

export const useStore = <TValue>(api: Store<TValue>) => [useSyncExternalStore(api.subscribe, api), api.set] as const;
