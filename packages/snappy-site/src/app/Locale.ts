import { getLocale } from "../shared/LocaleStore";
import { makeT } from "../shared/Translate";
import localeData from "./locales";

export type AppLocale = keyof typeof localeData;

const localeKeys = Object.keys(localeData) as AppLocale[];

export const t = makeT(localeData, getLocale as () => AppLocale);

export const AppLocale = { localeKeys, locales: localeData, t };
