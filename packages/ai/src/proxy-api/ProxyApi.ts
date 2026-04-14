// cspell:word dall
import openai from "openai";

import type { AiGenericModel, AiModelProvider } from "../Types";

import { Urls } from "./core";
import { Gpt_5_4_Mini, Gpt_5_4_Nano, Gpt_5_Mini } from "./models/chat";
import { Dall_E_3, Gemini_3_1_FlashImagePreview, Gpt_Image_1_5, Gpt_Image_1_Mini } from "./models/image";
import { Gpt_4_o_Transcribe, Whisper_1 } from "./models/speech-recognition";
import { ProxyApiCostCalculator } from "./ProxyApiCostCalculator";

export const ProxyApi: AiModelProvider = (apiKey, priceMultiplier) => {
  const client = new openai({ apiKey, baseURL: Urls.proxyApiOpenAiBaseUrl });
  const costCalculator = ProxyApiCostCalculator(priceMultiplier);

  return [
    Gpt_5_Mini(client, costCalculator),
    Gpt_5_4_Nano(client, costCalculator),
    Gpt_5_4_Mini(client, costCalculator),
    Gpt_4_o_Transcribe(client, costCalculator),
    Whisper_1(client, costCalculator),
    Dall_E_3(client, costCalculator),
    Gpt_Image_1_5(client, costCalculator),
    Gpt_Image_1_Mini(client, costCalculator),
    Gemini_3_1_FlashImagePreview(apiKey, costCalculator),
  ].map((model: AiGenericModel) => ({ ...model, source: `proxy-api` as const }));
};
