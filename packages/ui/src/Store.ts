import { Locale } from "@snappy/intl";
import { Language, Theme } from "@snappy/ui-core";

import { SavedStore } from "./SavedStore";

export const $locale = await SavedStore<Language>(Language.key, Locale.default);

export const $theme = await SavedStore<Theme>(Theme.key, `system`);
