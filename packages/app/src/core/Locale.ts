/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import { $locale } from "@snappy/ui";

import { localeData, makeT } from "../locales";

export type AppLocale = keyof typeof localeData;

const localeKeys = Object.keys(localeData) as AppLocale[];

export const t = makeT((() => $locale()) as () => AppLocale);

export const AppLocale = { localeKeys, locales: localeData, t };
