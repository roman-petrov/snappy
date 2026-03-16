import { Locale } from "@snappy/ui";

import { makeT } from "../locales";

export const t = makeT(() => Locale.effective());
