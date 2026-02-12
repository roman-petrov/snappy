import { getLocale } from "../shared/LocaleStore";
import { makeT } from "../shared/Translate";
import localeData from "./locales";

export type SiteLocale = keyof typeof localeData;

const localeKeys = Object.keys(localeData) as SiteLocale[];

export const t = makeT(localeData, getLocale as () => SiteLocale);

export const SiteLocale = { localeKeys, locales: localeData, t };
