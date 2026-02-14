/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import { I18n } from "@snappy/core";

import localeData from "./locales";

export type Locale = keyof typeof localeData;

const localeKeys = Object.keys(localeData) as Locale[];
const locale = (localeKey: Locale) => localeData[localeKey];

export const t = (localeKey: Locale, key: string, parameters?: Record<string, number | string>) => {
  const messages = locale(localeKey);
  const keys = key.split(`.`);
  const value = I18n.resolveByPath(messages as unknown, keys);

  if (value === I18n.notFoundSymbol) {
    return key;
  }

  const template = String(value);

  return parameters === undefined ? template : I18n.interpolate(template, Object.entries(parameters));
};

const userLanguage = (languageCode?: string) => {
  const code = languageCode?.toLowerCase();

  return code === undefined ? `en` : (localeKeys.find(loc => code.startsWith(loc)) ?? `en`);
};

export const Locale = { locale, localeKeys, locales: localeData, t, userLanguage };
