import type { ReadonlyStore } from "@snappy/core";

import { useStoreValue } from "../hooks/useStoreValue";

export const ReactiveStore = <TValue, TApi extends object>(store: ReadonlyStore<TValue>, api: TApi) => ({
  ...api,
  read: store,
  use: () => useStoreValue(store),
});
