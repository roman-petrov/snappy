import localeData from "./locales";

export type SiteLocale = keyof typeof localeData;

const localeKeys = Object.keys(localeData) as SiteLocale[];
const locale = (key: SiteLocale) => localeData[key];
const notFound = Symbol(`notFound`);

const resolveByPath = (current: unknown, keys: string[]) => {
  if (keys.length === 0) {
    return current;
  }
  const [first, ...rest] = keys;
  if (first === undefined || typeof current !== `object` || current === null || !(first in current)) {
    return notFound;
  }
  return resolveByPath((current as Record<string, unknown>)[first], rest);
};

const interpolate = (template: string, entries: [string, number | string][]) => {
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

export const t = (localeKey: SiteLocale, key: string, parameters?: Record<string, number | string>) => {
  const messages = locale(localeKey);
  const value = resolveByPath(messages as unknown, key.split(`.`));
  if (value === notFound) {
    return key;
  }
  const template = String(value);
  return parameters === undefined ? template : interpolate(template, Object.entries(parameters));
};

export const SiteLocale = { localeKeys, locales: localeData, t };
