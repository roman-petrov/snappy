import type { Theme } from "../core";

import { Theme as chat } from "./chat";
import { Theme as reasoning } from "./reasoning";

export const AiStreamThemes = [`chat`, `reasoning`] as const;

export type AiStreamTheme = (typeof AiStreamThemes)[number];

export const AiStreamTheme = { chat, reasoning } as const satisfies Record<AiStreamTheme, Theme>;
