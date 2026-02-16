import type { ReadonlyStore, StoreListener } from "@snappy/core";

import { useEffect } from "react";

export const useStoreSubscribe = <TValue>({ subscribe }: ReadonlyStore<TValue>, listener: StoreListener<TValue>) =>
  useEffect(() => subscribe(listener), [listener, subscribe]);
