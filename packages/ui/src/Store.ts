import { Store } from "@snappy/core";

import type { Locale, Theme } from "./core";

export const $serverMode = Store(false);

export const $theme = Store<Theme>(`light`);

export const $locale = Store<Locale>(`ru`);
