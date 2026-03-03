/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import { LocaleStore, Translate } from "@snappy/ui";

import localeData from "../locales";

export type AppLocale = keyof typeof localeData;

const localeKeys = Object.keys(localeData) as AppLocale[];

export const t = Translate.makeT(localeData, LocaleStore.getLocale as () => AppLocale);

export const AppLocale = { localeKeys, locales: localeData, t };
