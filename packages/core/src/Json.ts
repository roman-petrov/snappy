/* eslint-disable unicorn/no-null */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import { _ } from "./_";

const nullToUndefined = (value: unknown): unknown =>
  value === null
    ? undefined
    : _.isArray(value)
      ? value.map(nullToUndefined)
      : _.isObject(value)
        ? _.fromEntries(Object.entries(value).map(([key, v]) => [key, nullToUndefined(v)] as const))
        : value;

const normalize = <T>(value: T): T => nullToUndefined(value) as T;
const stringify = <T>(value: T) => JSON.stringify(value, (_key: string, v: unknown) => (v === undefined ? null : v));
const parse = <T>(value: string) => normalize(JSON.parse(value)) as T;

export const Json = { normalize, parse, stringify };
