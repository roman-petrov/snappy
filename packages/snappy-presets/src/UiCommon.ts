import { AiConstants } from "@snappy/ai";

import type { Bilingual } from "./Prompts";

const { maxSpeechFileMegaBytes } = AiConstants;

export const UiCommon = {
  audioFileHint: [`Max ${maxSpeechFileMegaBytes} MB`, `До ${maxSpeechFileMegaBytes} МБ`] as const satisfies Bilingual,
} as const;
