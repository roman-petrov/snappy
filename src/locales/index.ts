import { ru } from './ru';
import { en } from './en';

export type Locale = 'ru' | 'en';

export type Messages = typeof ru;

export const locales: Record<Locale, Messages> = {
  ru,
  en,
};

export const getLocale = (locale: Locale): Messages => {
  return locales[locale] || locales.ru;
};

export const t = (locale: Locale, key: string, params?: Record<string, string | number>): string => {
  const messages = getLocale(locale);
  const keys = key.split('.');
  
  let value: unknown = messages;
  for (const k of keys) {
    if (typeof value === 'object' && value !== null && k in value) {
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
