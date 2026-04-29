import type { Locale } from "@snappy/intl";

import { Translate } from "@snappy/core";

import { en } from "./en";
import { ru } from "./ru";

export const t = (locale: Locale) => Translate.makeT({ en, ru } as const, () => locale);

export type TFunction = ReturnType<typeof t>;
