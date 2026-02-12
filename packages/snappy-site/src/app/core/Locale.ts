import { LocaleStore } from "../../shared/LocaleStore";
import { Translate } from "../../shared/Translate";
import localeData from "../locales";

export type AppLocale = keyof typeof localeData;

const localeKeys = Object.keys(localeData) as AppLocale[];

export const t = Translate.makeT(localeData, LocaleStore.getLocale as () => AppLocale);

export const AppLocale = { localeKeys, locales: localeData, t };
