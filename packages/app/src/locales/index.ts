import { Translate } from "@snappy/core";
import { Language } from "@snappy/ui";

import { en } from "./en";
import { ru } from "./ru";

export const t = Translate.makeT({ en, ru } as const, () => Language.locale());
