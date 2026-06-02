import { TranslateFunction } from "@snappy/ui";

import { en } from "./en";
import { ru } from "./ru";

const localeData = { en, ru } as const;

export { localeData };

export const t = TranslateFunction(localeData);
