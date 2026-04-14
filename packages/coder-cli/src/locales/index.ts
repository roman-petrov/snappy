/* jscpd:ignore-start */
import type { AiLocale } from "@snappy/ai";

import { Translate } from "@snappy/core";

import { en } from "./en";
import { ru } from "./ru";

const localeData = { en, ru } as const;

export type LocaleKey = keyof typeof localeData;

export { localeData };

export const makeT = (getLocale: () => LocaleKey) => Translate.makeT(localeData, getLocale);

export type TFunction = ReturnType<typeof makeT>;

export const t = (locale: AiLocale) => makeT(() => locale);
/* jscpd:ignore-end */
