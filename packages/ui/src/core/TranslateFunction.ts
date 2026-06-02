import { Translate } from "@snappy/core";

import { Language } from "./Language";

export const TranslateFunction = <const T extends Record<string, unknown>>(localeData: T) =>
  Translate.makeT(localeData, Language.locale);
