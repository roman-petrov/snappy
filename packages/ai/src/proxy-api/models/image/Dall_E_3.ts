/* eslint-disable unicorn/filename-case */
/* eslint-disable @typescript-eslint/naming-convention */
// cspell:word dall
import type { OpenAI } from "openai";

import type { ProxyApiCostCalculator } from "../../ProxyApiCostCalculator";

import { OpenAiImageModel } from "../../core";

const modelId = `dall-e-3`;

export const Dall_E_3 = (client: OpenAI, calculator: ProxyApiCostCalculator) =>
  OpenAiImageModel({
    b64JsonResponse: true,
    cost: (totalTokens, size) => calculator.image(modelId, { size, totalTokens }),
    name: modelId,
  })(client);
