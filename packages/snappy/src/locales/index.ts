import { en } from "./en";
import { ru } from "./ru";

export type Locale = `en` | `ru`;

export type Messages = typeof ru;

export const locales: Record<Locale, Messages> = { en, ru };

export const getLocale = (locale: Locale): Messages => locales[locale] || locales.ru;

export const t = (locale: Locale, key: string, params?: Record<string, number | string>): string => {
  const messages = getLocale(locale);
  const keys = key.split(`.`);
  let value: unknown = messages;
  for (const k of keys) {
    if (typeof value === `object` && value !== null && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return key;
    }
  }

  let result = String(value);

  if (params) {
    for (const [paramKey, paramValue] of Object.entries(params)) {
      result = result.replace(`{${paramKey}}`, String(paramValue));
    }
  }

  return result;
};
