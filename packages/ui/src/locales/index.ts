/* jscpd:ignore-start */
import { Translate } from "@snappy/core";

import { $locale } from "../Store";
import { en } from "./en";
import { ru } from "./ru";

const localeData = { en, ru } as const;

export type LocaleKey = keyof typeof localeData;

export { localeData };

export const makeT = (getLocale: () => LocaleKey) => Translate.makeT(localeData, getLocale);

export const t = makeT(() => $locale.value);
/* jscpd:ignore-end */
