import { Serializer } from "@snappy/core";

import type { Locale, Theme } from "./core";

import { AndroidBridge } from "./core/AndroidBridge";
import { SavedStore } from "./SavedStore";

export const $locale = await SavedStore<Locale>(`snappy-locale`, `system`);

export const $theme = await SavedStore<Theme>(`snappy-theme`, `system`);

export const $fog = await SavedStore(`snappy-fog`, AndroidBridge.available, Serializer.boolean);
