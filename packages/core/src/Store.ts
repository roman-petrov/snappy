// cspell:word zustand
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/immutable-data */
import type { Action } from "./Types";

import { _ } from "./_";

/**
 * ? The implementation is designed for "useSyncExternalStore" https://react.dev/reference/react/useSyncExternalStore
 * ? and inspired by "zustand" https://github.com/pmndrs/zustand
 */

export type ReadonlyStore<TValue> = (() => TValue) & ReadonlyStoreApi<TValue>;

export type ReadonlyStoreApi<TValue> = {
  filter: (equals: (a: TValue, b: TValue) => boolean) => ReadonlyStore<TValue>;
  map: <TTarget>(map: (value: TValue) => TTarget) => ReadonlyStore<TTarget>;
  subscribe: (listener: StoreListener<TValue>) => Action;
};

export type Store<TValue> = ReadonlyStore<TValue> & StoreApi<TValue>;

export type StoreApi<TValue> = ReadonlyStoreApi<TValue> & { set: (value: TValue) => void };

export type StoreListener<TValue> = (current: TValue, previous: TValue) => void;

export const Store = <TValue>(initialValue: TValue): Store<TValue> => {
  const readonly = <T>(
    getSource: () => ReadonlyStore<T>,
    getValue: () => T,
    subscribe: ReadonlyStoreApi<T>[`subscribe`],
  ) => {
    const derived = <TTarget>(
      getNext: (value: T) => TTarget,
      equals: (a: TTarget, b: TTarget) => boolean = (a, b) => a === b,
    ) => {
      const source = getSource();
      let derivedCurrent = getNext(source());
      const { add: derivedAdd, items: derivedItems } = _.list<StoreListener<TTarget>>();

      const unsubscribe = source.subscribe(() => {
        const previous = derivedCurrent;
        const next = getNext(source());
        if (!equals(next, previous)) {
          derivedCurrent = next;
          _.singleAction(derivedItems())(derivedCurrent, previous);
        }
      });

      const derivedSubscribe = (listener: StoreListener<TTarget>) => {
        const unsubscribeListener = derivedAdd(listener);

        return () => {
          unsubscribeListener();
          if (derivedItems().length === 0) {
            unsubscribe();
          }
        };
      };

      const create = (): ReadonlyStore<TTarget> => readonly(create, () => derivedCurrent, derivedSubscribe);

      return create();
    };

    const map = <TTarget>(mapFn: (value: T) => TTarget) => derived(mapFn);
    const filter = (equals: (a: T, b: T) => boolean) => derived(value => value, equals);

    return Object.assign(getValue, { filter, map, subscribe }) as ReadonlyStore<T>;
  };

  let current = initialValue;
  const { add, items } = _.list<StoreListener<TValue>>();

  const set = (value: TValue) => {
    const previous = current;
    current = value;

    if (current !== previous) {
      _.singleAction(items())(current, previous);
    }
  };

  const create = (): Store<TValue> =>
    Object.assign(
      readonly(create, () => current, add),
      { set },
    );

  return create();
};
