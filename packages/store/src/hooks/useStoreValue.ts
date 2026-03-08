import type { ReadonlyStore } from "@snappy/core";

import { useSyncExternalStore } from "./useSyncExternalStore";

export const useStoreValue = <TValue>(api: ReadonlyStore<TValue>) => useSyncExternalStore(api.subscribe, api, api);
