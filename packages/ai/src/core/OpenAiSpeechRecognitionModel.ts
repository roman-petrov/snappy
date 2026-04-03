import { type OpenAI, toFile } from "openai";

import type { AiGenericSpeechRecognitionModel } from "../Types";

export type OpenAiSpeechRecognitionModelDefinition = {
  cost: (promptTok: number, completionTok: number, byteLength: number, audioSeconds: number) => number;
  name: string;
};

export const OpenAiSpeechRecognitionModel =
  ({ cost, name }: OpenAiSpeechRecognitionModelDefinition) =>
  (client: InstanceType<typeof OpenAI>): AiGenericSpeechRecognitionModel => {
    const process: AiGenericSpeechRecognitionModel[`process`] = async input => {
      const file = await toFile(Buffer.from(input.bytes), input.fileName, { type: input.mimeType });
      const transcription = await client.audio.transcriptions.create({ file, model: name, response_format: `json` });
      const { text, usage } = transcription;
      const promptTok = usage?.type === `tokens` ? usage.input_tokens : 0;
      const completionTok = usage?.type === `tokens` ? usage.output_tokens : 0;
      const audioSeconds = usage?.type === `duration` ? usage.seconds : 0;
      const costValue = cost(promptTok, completionTok, input.bytes.length, audioSeconds);

      return { cost: costValue, text };
    };

    return { name, process, type: `speech-recognition` };
  };
