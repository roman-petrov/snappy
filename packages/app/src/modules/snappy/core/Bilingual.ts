import type { Locale } from "@snappy/intl";

export type Bilingual = readonly [en: string, ru: string];

const pick = (value: Bilingual, locale: Locale): string => (locale === `en` ? value[0] : value[1]);

export const Bilingual = { pick };
