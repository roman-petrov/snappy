import { Translate } from "../../shared/Translate";
import localeData from "../locales";
import { SiteLocaleStore } from "./SiteLocaleStore";

export type SiteLocale = keyof typeof localeData;

const localeKeys = Object.keys(localeData) as SiteLocale[];

export const t = Translate.makeT(localeData, SiteLocaleStore.getSiteLocale as () => SiteLocale);

export const SiteLocale = {
  getSiteLocale: SiteLocaleStore.getSiteLocale,
  localeKeys,
  locales: localeData,
  setSiteLocale: SiteLocaleStore.setSiteLocale,
  t,
};
