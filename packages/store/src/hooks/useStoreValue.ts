import type { ReadonlyStore } from "@snappy/core";

import { useSyncExternalStore } from "react";

export const useStoreValue = <TValue>(store: ReadonlyStore<TValue>) =>
  useSyncExternalStore(store.subscribe, store, store);
