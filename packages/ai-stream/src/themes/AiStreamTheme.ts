import { Theme as chat } from "./chat";
import { Theme as reasoning } from "./reasoning";

export const AiStreamTheme = { chat, reasoning } as const;

export type AiStreamTheme = keyof typeof AiStreamTheme;
