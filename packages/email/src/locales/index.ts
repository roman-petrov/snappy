import type { Locale } from "@snappy/intl";

import { Translate } from "@snappy/core";

import { en } from "./en";
import { ru } from "./ru";

const localeData = { en, ru } as const;

const t = (locale: Locale, key: string, parameters?: Record<string, number | string>) =>
  Translate.makeT(localeData, () => locale)(key, parameters);

export { t };
