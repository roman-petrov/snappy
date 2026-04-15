import type { OpenAI } from "openai";

import type { ProxyApiCostCalculator, ProxyApiSpeechCostModelId } from "../../ProxyApiCostCalculator";

import { OpenAiSpeechRecognitionModel } from "../../core";

export const SpeechRecognitionModel =
  (modelId: ProxyApiSpeechCostModelId, calculator: ProxyApiCostCalculator) => (client: OpenAI) =>
    OpenAiSpeechRecognitionModel({
      cost: (promptTok, completionTok, byteLength, audioSeconds) =>
        calculator.speech(modelId, { audioSeconds, byteLength, completionTok, promptTok }),
      name: modelId,
    })(client);
