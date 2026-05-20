import type { Locale } from "@snappy/intl";

const key = `snappy-locale`;

export type Language = `system` | Locale;

const resolve = (value: Language | undefined): Locale => (value === `en` || value === `ru` ? value : `ru`);

export const Language = { key, resolve };
