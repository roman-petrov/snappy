import type { Store } from "@snappy/core";

import { useSyncExternalStore } from "react";

export const useStore = <TValue>(store: Store<TValue>) =>
  [useSyncExternalStore(store.subscribe, store, store), store.set] as const;
