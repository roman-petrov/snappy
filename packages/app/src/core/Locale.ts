import { _ } from "@snappy/core";
import { $locale } from "@snappy/ui";

import { localeData, makeT } from "../locales";

export type AppLocale = keyof typeof localeData;

const localeKeys = _.keys(localeData);

export const t = makeT((() => $locale.value) as () => AppLocale);

export const AppLocale = { localeKeys, locales: localeData, t };
