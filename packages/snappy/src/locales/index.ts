/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import { en } from "./en";
import { ru } from "./ru";

export type Locale = `en` | `ru`;

export type Messages = typeof ru;

export const locales: Record<Locale, Messages> = { en, ru };

export const getLocale = (locale: Locale): Messages => locales[locale];

export const t = (locale: Locale, key: string, parameters?: Record<string, number | string>): string => {
  const messages = getLocale(locale);
  const keys = key.split(`.`);
  let value: unknown = messages;
  for (const keyPart of keys) {
    if (typeof value === `object` && value !== null && keyPart in value) {
      const record = value as Record<string, unknown>;
      value = record[keyPart];
    } else {
      return key;
    }
  }

  let result = String(value);

  if (parameters !== undefined) {
    for (const [parameterKey, parameterValue] of Object.entries(parameters)) {
      result = result.replace(`{${parameterKey}}`, String(parameterValue));
    }
  }

  return result;
};
