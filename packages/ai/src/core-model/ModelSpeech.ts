import type { AiHttpConfig } from "../AiHttp";
import type { AiModelCapabilities, AiSpeechTranscribeInput, AiSpeechTranscribeResult } from "../Types";
import type { AiModelEntry } from "./Entry";

import { AiAudio } from "../AiAudio";
import { ModelEntry } from "./ModelEntry";

export type AiSpeechModel = CatalogSpeech & {
  transcribe: (input: AiSpeechTranscribeInput) => Promise<AiSpeechTranscribeResult>;
};

export type CatalogSpeech = AiModelEntry & { type: `speech-recognition` };

export const ModelSpeech = (props: {
  capabilities: AiModelCapabilities;
  name: string;
}): CatalogSpeech & { of: (http: AiHttpConfig) => AiSpeechModel } =>
  ModelEntry.bind(`speech-recognition`, props, (http, catalog) => ({
    ...catalog,
    transcribe: async input => AiAudio.transcription(http, catalog, input),
  }));
