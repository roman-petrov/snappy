import type { Bilingual } from "@snappy/intl";

import { AiConstants } from "@snappy/ai";

const { maxSpeechFileMegaBytes } = AiConstants;

export const UiCommon = {
  audioFileHint: [`Max ${maxSpeechFileMegaBytes} MB`, `До ${maxSpeechFileMegaBytes} МБ`] as const satisfies Bilingual,
} as const;
