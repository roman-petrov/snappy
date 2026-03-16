/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
const entries = <TObject extends object>(value: TObject) =>
  Object.entries(value) as { [Key in keyof TObject]: [Key, TObject[Key]] }[keyof TObject][];

const fromEntries = <TKey extends number | string | symbol, TValue>(value: (readonly [TKey, TValue])[]) =>
  Object.fromEntries(value) as Record<TKey, TValue>;

const keys = <TKey extends keyof TObject, TObject extends Record<TKey, unknown>>(object: TObject) =>
  Object.keys(object) as TKey[];

export const ObjectValue = { entries, fromEntries, keys };
