import { _ } from "@snappy/core";

import { localeData, makeT } from "./locales";

export type Locale = keyof typeof localeData;

const localeKeys = _.keys(localeData);
const locale = (localeKey: Locale) => localeData[localeKey];

export const t = (localeKey: Locale, key: string, parameters?: Record<string, number | string>) =>
  makeT(() => localeKey)(key, parameters);

const userLanguage = (languageCode?: string) => {
  const code = languageCode?.toLowerCase();

  return code === undefined ? `en` : (localeKeys.find(loc => code.startsWith(loc)) ?? `en`);
};

export const Locale = { locale, localeKeys, locales: localeData, t, userLanguage };
