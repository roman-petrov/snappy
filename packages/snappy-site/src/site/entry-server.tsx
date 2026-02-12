import { renderToString } from "react-dom/server";

import { Landing } from "./Landing";
import { SiteLocaleStore } from "./SiteLocaleStore";

export type SiteLocaleKey = `en` | `ru`;

export const render = (locale: SiteLocaleKey = `ru`): string => {
  SiteLocaleStore.setServerLocale(locale);
  return renderToString(<Landing />);
};
