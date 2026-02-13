/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
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
  const [key, value] = first;

  return interpolate(template.replace(`{${key}}`, String(value)), rest);
};

const makeT = <T extends string>(
  localeData: Record<T, unknown>,
  getLocale: () => T,
): ((key: string, parameters?: Record<string, number | string>) => string) => {
  const locale = (key: T) => localeData[key];

  return (key: string, parameters?: Record<string, number | string>) => {
    const localeKey = getLocale();
    const messages = locale(localeKey);
    const value = resolveByPath(messages, key.split(`.`));
    if (value === notFound) {
      return key;
    }
    const template = String(value);

    return parameters === undefined ? template : interpolate(template, Object.entries(parameters));
  };
};

export const Translate = { makeT };
