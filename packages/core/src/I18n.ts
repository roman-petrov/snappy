/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import { _ } from "./_";

const notFound = Symbol(`notFound`);

const resolveByPath = (current: unknown, keys: string[]): unknown => {
  if (keys.length === 0) {
    return current;
  }

  const [first, ...rest] = keys;

  if (first === undefined || current === null || !_.isObject(current) || !(first in current)) {
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

  const [key, value] = first;

  return interpolate(template.replace(`{${key}}`, String(value)), rest);
};

export const I18n = { interpolate, notFoundSymbol: notFound, resolveByPath };
