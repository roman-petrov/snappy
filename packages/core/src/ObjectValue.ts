/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
const fromEntries = <TKey extends number | string | symbol, TValue>(value: (readonly [TKey, TValue])[]) =>
  Object.fromEntries(value) as Record<TKey, TValue>;

export const ObjectValue = { fromEntries };
