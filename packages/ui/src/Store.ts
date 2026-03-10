import { signal } from "@preact/signals";

import type { Locale, Theme } from "./core";

export const $serverMode = signal(false);

export const $theme = signal<Theme>(`light`);

export const $locale = signal<Locale>(`ru`);
