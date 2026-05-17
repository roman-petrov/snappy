import { Serializer } from "@snappy/core";

import type { Language, Theme } from "./core";

import { Bridge } from "@snappy/platform";
import { SavedStore } from "./SavedStore";

export const $locale = await SavedStore<Language>(`snappy-locale`, `system`);

export const $theme = await SavedStore<Theme>(`snappy-theme`, `system`);

export const $fog = await SavedStore(`snappy-fog`, Bridge.available, Serializer.boolean);
