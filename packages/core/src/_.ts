/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable no-empty-function */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
import type { Action } from "./Types";

import { DateTime } from "./DateTime";
import { ObjectValue } from "./ObjectValue";
import { Time } from "./Time";

const base64decode = (s: string) => Buffer.from(s, `base64`).toString(`utf8`);
const camelCase = (s: string) => s.replaceAll(/-(?<c>[a-z])/gu, (_, c: string) => c.toUpperCase());

const pascalCase = (s: string) => {
  const c = camelCase(s);

  return c.length === 0 ? `` : (c[0] ?? ``).toUpperCase() + c.slice(1);
};

const isArray = (value: unknown): value is unknown[] => Array.isArray(value);
const isBoolean = (value: unknown): value is boolean => typeof value === `boolean`;

type AnyFunction = (...args: never[]) => unknown;

const isFunction = <T extends AnyFunction = AnyFunction>(value: unknown): value is T => typeof value === `function`;
const isNumber = (value: unknown): value is number => typeof value === `number`;
const isObject = (value: unknown): value is object => typeof value === `object`;
const isString = (value: unknown): value is string => typeof value === `string`;

const list = <TElement>() => {
  let elements: readonly TElement[] = [];

  const add = (item: TElement): Action => {
    elements = [...elements, item];

    return () => (elements = elements.filter(element => element !== item));
  };

  const items = () => elements;

  return { add, items };
};

const singleAction =
  <T extends (...args: Parameters<T>) => ReturnType<T>>(actions: readonly T[]) =>
  (...args: Parameters<T>) => {
    for (const action of actions) {
      action(...args);
    }
  };

const cn = (...parts: readonly (false | string | undefined)[]) => parts.filter(Boolean).join(` `).trim();

const int = (s: string, radix: 10 | 16) => {
  const parsed = Number.parseInt(s, radix);

  return Number.isNaN(parsed) ? undefined : parsed;
};

const dec = (s: string) => int(s, 10);
const hex = (s: string) => int(s, 16);
const noop = () => {};

const round = (value: number, fractionDigits: number) => {
  const factor = 10 ** fractionDigits;

  return Math.round(value * factor) / factor;
};

const b1024 = 1024;
const kb = (kiloBytes: number) => kiloBytes * b1024;
const mb = (megaBytes: number) => kb(kb(megaBytes));
const gb = (gigaBytes: number) => kb(mb(gigaBytes));

export const _ = {
  ...DateTime,
  ...ObjectValue,
  ...Time.constants,
  base64decode,
  camelCase,
  cn,
  daysInWeek: Time.daysInWeek,
  daysInYear: Time.daysInYear,
  dec,
  gb,
  hex,
  isArray,
  isBoolean,
  isFunction,
  isNumber,
  isObject,
  isString,
  kb,
  list,
  mb,
  noop,
  pascalCase,
  round,
  singleAction,
  timeBuild: Time.build,
  timeGet: Time.get,
  timeMap: Time.map,
  timeParts: Time.parts,
  timeSet: Time.set,
};
