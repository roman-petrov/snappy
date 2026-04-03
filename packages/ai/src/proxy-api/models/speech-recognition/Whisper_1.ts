/* eslint-disable @typescript-eslint/naming-convention */
import type openai from "openai";

import type { ProxyApiCostCalculator } from "../../ProxyApiCostCalculator";

import { OpenAiSpeechRecognitionModel } from "../../core";

const modelId = `whisper-1`;

export const Whisper_1 = (client: InstanceType<typeof openai>, calculator: ProxyApiCostCalculator) =>
  OpenAiSpeechRecognitionModel({
    cost: (promptTok, completionTok, byteLength, audioSeconds) =>
      calculator.speech(modelId, { audioSeconds, byteLength, completionTok, promptTok }),
    name: modelId,
  })(client);
