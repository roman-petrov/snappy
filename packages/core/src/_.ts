/* eslint-disable @typescript-eslint/naming-convention */
const base64decode = (s: string): string => Buffer.from(s, `base64`).toString(`utf-8`);
const camelCase = (s: string): string => s.replaceAll(/-(?<c>[a-z])/gu, (_, c: string) => c.toUpperCase());
const isArray = (value: unknown): value is unknown[] => Array.isArray(value);
const isBoolean = (value: unknown): value is boolean => typeof value === `boolean`;
const isFunction = (value: unknown): value is (...args: unknown[]) => unknown => typeof value === `function`;
const isNumber = (value: unknown): value is number => typeof value === `number`;
const isObject = (value: unknown): value is object => typeof value === `object`;
const isString = (value: unknown): value is string => typeof value === `string`;

export const _ = { base64decode, camelCase, isArray, isBoolean, isFunction, isNumber, isObject, isString };
