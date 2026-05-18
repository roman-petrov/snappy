/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable functional/no-expression-statements */
import type { AiAudioTranscriptionsCreateInput } from "./Types";

import { AiCost } from "./AiCost";
import { AiHttp, type AiHttpConfig } from "./AiHttp";

type TranscriptionResponse = { text: string; usage?: { cost_rub?: number } };

const transcription = async (http: AiHttpConfig, { file, model }: AiAudioTranscriptionsCreateInput) => {
  const form = new FormData();
  form.append(`file`, new Blob([Uint8Array.from(file.bytes)], { type: file.mimeType }), file.fileName);
  form.append(`model`, model);
  const result = await AiHttp.postForm<TranscriptionResponse>(http, `/audio/transcriptions`, form);

  return { cost: AiCost.cost(result.usage), text: result.text };
};

export const AiAudio = { transcription };
