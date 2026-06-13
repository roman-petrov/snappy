/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable functional/no-expression-statements */
import type { AiAudioTranscriptionsCreateInput } from "./Types";

import { AiCost } from "./AiCost";
import { AiHttp, type AiHttpConfig } from "./AiHttp";

type TranscriptionResponse = { text: string; usage?: { cost_rub?: number } };

const transcription = async (http: AiHttpConfig, { file, model }: AiAudioTranscriptionsCreateInput) => {
  const form = new FormData();
  const mimeType = file.type.trim() === `` ? `application/octet-stream` : file.type;
  form.append(`file`, new Blob([await file.arrayBuffer()], { type: mimeType }), file.name);
  form.append(`model`, model);
  const result = await AiHttp.postForm<TranscriptionResponse>(http, `/audio/transcriptions`, form);

  return { cost: AiCost.cost(result.usage), text: result.text };
};

export const AiAudio = { transcription };
