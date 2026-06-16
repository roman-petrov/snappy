import { Language, Theme } from "@snappy/ui-core";

import { SavedStore } from "./SavedStore";

export const $locale = await SavedStore<Language>(Language.key, `system`);

export const $theme = await SavedStore<Theme>(Theme.key, `system`);
