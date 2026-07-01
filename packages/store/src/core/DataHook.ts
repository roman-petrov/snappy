/* eslint-disable functional/immutable-data */
import type { ReadonlyStore } from "@snappy/core";

import { useStoreValue } from "../hooks/useStoreValue";

export type DataHook<TValue, R> = (() => R) & { read: ReadonlyStore<TValue> };

export const DataHook = <TValue, R>(
  store: ReadonlyStore<TValue>,
  select: (value: TValue) => R,
): DataHook<TValue, R> => {
  const useSlice = () => select(useStoreValue(store));

  return Object.assign(useSlice, { read: store });
};
