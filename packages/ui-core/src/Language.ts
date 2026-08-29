import type { Locale } from "@snappy/intl";

const key = `snappy-locale`;

export type Language = `system` | Locale;

const fromSystem = (language: string | undefined): Locale =>
  language?.toLowerCase().startsWith(`ru`) === true ? `ru` : `en`;

const resolve = (value: Language | undefined, language?: string): Locale =>
  value === `en` || value === `ru` ? value : fromSystem(language);

export const Language = { key, resolve };
