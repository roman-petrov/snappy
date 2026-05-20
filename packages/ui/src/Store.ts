import { Serializer } from "@snappy/core";
import { Bridge } from "@snappy/platform";
import { Language, Theme } from "@snappy/ui-core";

import { SavedStore } from "./SavedStore";

export const $locale = await SavedStore<Language>(Language.key, `system`);

export const $theme = await SavedStore<Theme>(Theme.key, `system`);

export const $fog = await SavedStore(`snappy-fog`, Bridge.available, Serializer.boolean);
