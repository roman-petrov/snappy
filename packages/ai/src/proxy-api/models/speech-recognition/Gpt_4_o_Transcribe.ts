/* eslint-disable unicorn/filename-case */
/* eslint-disable @typescript-eslint/naming-convention */
import type openai from "openai";

import type { ProxyApiCostCalculator } from "../../ProxyApiCostCalculator";

import { OpenAiSpeechRecognitionModel } from "../../core";

const modelId = `gpt-4o-transcribe`;

export const Gpt_4_o_Transcribe = (client: InstanceType<typeof openai>, calculator: ProxyApiCostCalculator) =>
  OpenAiSpeechRecognitionModel({
    cost: (promptTok, completionTok, byteLength, audioSeconds) =>
      calculator.speech(modelId, { audioSeconds, byteLength, completionTok, promptTok }),
    name: modelId,
  })(client);
