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
import { Stats } from "./Stats";
import { Time } from "./Time";

const base64decode = (s: string) => Buffer.from(s, `base64`).toString(`utf8`);
const camelCase = (s: string) => s.replaceAll(/-(?<c>[a-z])/gu, (_, c: string) => c.toUpperCase());
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const kebabCase = (s: string) =>
  s
    .replaceAll(/(?<=[0-9a-z])(?=[A-Z])/gu, `-`)
    .replaceAll(/[\s_]+/gu, `-`)
    .toLowerCase();

const pascalCase = (s: string) => {
  const c = camelCase(s);

  return c.length === 0 ? `` : (c[0] ?? ``).toUpperCase() + c.slice(1);
};

const px = (value: number) => `${value}px`;

const sentenceCase = (s: string) => {
  const spaced = kebabCase(s).replaceAll(`-`, ` `).replaceAll(/\s+/gu, ` `).trim();

  return spaced.length === 0 ? `` : (spaced[0] ?? ``).toUpperCase() + spaced.slice(1).toLowerCase();
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
const percentScale = 100;
const ratio = (part: number, total: number) => (total === 0 ? 0 : part / total);
const percent = (part: number, total: number) => ratio(part, total) * percentScale;

const gen = <TItem>(count: number, map: (index: number) => TItem) =>
  Array.from({ length: Math.max(0, count) }, (_, index) => map(index));

const round = (value: number, fractionDigits: number) => {
  const factor = 10 ** fractionDigits;

  return Math.round(value * factor) / factor;
};

const lerp = (start: number, end: number, t: number) => start + (end - start) * t;
const b1024 = 1024;

const byteSize = (bytes: number) => {
  const units = [`B`, `KB`, `MB`, `GB`] as const;

  if (bytes === 0) {
    return `0 B`;
  }
  let size = bytes;
  let unit = 0;
  while (size >= b1024 && unit < units.length - 1) {
    size /= b1024;
    unit += 1;
  }
  const rounded = unit === 0 || size >= 10 ? Math.round(size) : Math.round(size * 10) / 10;

  return `${rounded} ${units[unit]}`;
};

const kb = (kiloBytes: number) => kiloBytes * b1024;
const mb = (megaBytes: number) => kb(kb(megaBytes));
const gb = (gigaBytes: number) => kb(mb(gigaBytes));
const https = (authority: string) => `https://${authority}`;

export const _ = {
  ...DateTime,
  ...ObjectValue,
  ...Stats,
  ...Time.constants,
  base64decode,
  byteSize,
  camelCase,
  clamp,
  cn,
  daysInWeek: Time.daysInWeek,
  daysInYear: Time.daysInYear,
  dec,
  gb,
  gen,
  hex,
  https,
  isArray,
  isBoolean,
  isFunction,
  isNumber,
  isObject,
  isString,
  kb,
  kebabCase,
  lerp,
  list,
  mb,
  noop,
  pascalCase,
  percent,
  percentScale,
  px,
  ratio,
  round,
  sentenceCase,
  singleAction,
  timeBuild: Time.build,
  timeGet: Time.get,
  timeMap: Time.map,
  timeParts: Time.parts,
  timeSet: Time.set,
};
