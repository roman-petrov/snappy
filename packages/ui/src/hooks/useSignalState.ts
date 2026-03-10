/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import { useSignal } from "@preact/signals";
import { _ } from "@snappy/core";

export type SetSignalStateAction<T> = ((previous: T) => T) | T;

export const useSignalState = <T>(initial: T): [T, (value: SetSignalStateAction<T>) => void] => {
  const signal = useSignal(initial);

  const setValue = (value: SetSignalStateAction<T>) => {
    signal.value = _.isFunction(value) ? (value as (previous: T) => T)(signal.value) : (value as T);
  };

  return [signal.value, setValue];
};
