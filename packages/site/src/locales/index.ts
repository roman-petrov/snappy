import { Translate } from "@snappy/core";
import { Language } from "@snappy/ui";

import { en } from "./en";
import { ru } from "./ru";

const localeData = { en, ru } as const;

export { localeData };

export const t = Translate.makeT(localeData, () => Language.locale());
