import type { Store } from "@snappy/core";

import { useSyncExternalStore } from "./useSyncExternalStore";

export const useStore = <TValue>(api: Store<TValue>) =>
  [useSyncExternalStore(api.subscribe, api, api), api.set] as const;
