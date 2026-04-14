import type { Transcription } from "openai/resources/audio/transcriptions";

import { type OpenAI, toFile } from "openai";

import type { AiGenericSpeechRecognitionModel } from "../Types";

export type OpenAiSpeechRecognitionModelConfig = {
  cost: (usage: OpenAiSpeechRecognitionUsage | undefined) => number;
  name: string;
};

export type OpenAiSpeechRecognitionUsage = Transcription[`usage`];

export const OpenAiSpeechRecognitionModel =
  ({ cost, name }: OpenAiSpeechRecognitionModelConfig) =>
  (client: OpenAI): AiGenericSpeechRecognitionModel => {
    const process: AiGenericSpeechRecognitionModel[`process`] = async input => {
      const file = await toFile(new Uint8Array(input.bytes), input.fileName, { type: input.mimeType });
      const transcription = await client.audio.transcriptions.create({ file, model: name, response_format: `json` });
      const { text, usage } = transcription;

      return { cost: cost(usage), text };
    };

    return { name, process, type: `speech-recognition` };
  };
