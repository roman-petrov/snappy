/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import { en } from "./en";
import { ru } from "./ru";

export type Locale = `en` | `ru`;

export type Messages = typeof ru;

export const locales: Record<Locale, Messages> = { en, ru };

export const getLocale = (locale: Locale): Messages => locales[locale];

const notFound = Symbol(`notFound`);

const resolveByPath = (current: unknown, keys: string[]): unknown => {
  if (keys.length === 0) {
    return current;
  }

  const [first, ...rest] = keys;

  if (first === undefined || typeof current !== `object` || current === null || !(first in current)) {
    return notFound;
  }

  return resolveByPath((current as Record<string, unknown>)[first], rest);
};

const interpolate = (template: string, entries: [string, number | string][]): string => {
  if (entries.length === 0) {
    return template;
  }

  const [first, ...rest] = entries;

  if (first === undefined) {
    return template;
  }

  const [parameterKey, parameterValue] = first;
  const next = template.replace(`{${parameterKey}}`, String(parameterValue));

  return interpolate(next, rest);
};

export const t = (locale: Locale, key: string, parameters?: Record<string, number | string>): string => {
  const messages = getLocale(locale);
  const keys = key.split(`.`);
  const value = resolveByPath(messages as unknown, keys);

  if (value === notFound) {
    return key;
  }

  const template = String(value);

  return parameters === undefined ? template : interpolate(template, Object.entries(parameters));
};
