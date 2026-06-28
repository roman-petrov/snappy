/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable functional/no-expression-statements */
import { MimeType } from "@snappy/core";

import type { CatalogSpeech } from "./core-model/ModelSpeech";
import type { AiSpeechTranscribeInput, AiSpeechTranscribeResult } from "./Types";

import { AiCost } from "./AiCost";
import { AiHttp, type AiHttpConfig } from "./AiHttp";

type TranscriptionResponse = { text: string; usage?: { cost_rub?: number } };

const transcription = async (
  http: AiHttpConfig,
  catalog: CatalogSpeech,
  { file }: AiSpeechTranscribeInput,
): Promise<AiSpeechTranscribeResult> => {
  const form = new FormData();
  const mimeType = file.type.trim() === `` ? MimeType.octetStream : file.type;
  form.append(`file`, new Blob([await file.arrayBuffer()], { type: mimeType }), file.name);
  form.append(`model`, catalog.name);
  const result = await AiHttp.postForm<TranscriptionResponse>(http, `/audio/transcriptions`, form);

  return { cost: AiCost.cost(result.usage), text: result.text };
};

export const AiAudio = { transcription };
