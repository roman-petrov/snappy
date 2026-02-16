/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/strict-void-return */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
import type { Action } from "./Types";

const base64decode = (s: string) => Buffer.from(s, `base64`).toString(`utf-8`);
const camelCase = (s: string) => s.replaceAll(/-(?<c>[a-z])/gu, (_, c: string) => c.toUpperCase());
const isArray = (value: unknown): value is unknown[] => Array.isArray(value);
const isBoolean = (value: unknown): value is boolean => typeof value === `boolean`;
const isFunction = (value: unknown): value is (...args: unknown[]) => unknown => typeof value === `function`;
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

export const _ = {
  base64decode,
  camelCase,
  isArray,
  isBoolean,
  isFunction,
  isNumber,
  isObject,
  isString,
  list,
  singleAction,
};
