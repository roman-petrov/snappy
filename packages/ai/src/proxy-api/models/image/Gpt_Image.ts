/* eslint-disable unicorn/filename-case */
/* eslint-disable @typescript-eslint/naming-convention */
import type { OpenAI } from "openai";

import type { ProxyApiCostCalculator, ProxyApiImageCostModelId } from "../../ProxyApiCostCalculator";

import { OpenAiImageModel } from "../../core";

export const Gpt_Image = (modelId: ProxyApiImageCostModelId) => (client: OpenAI, calculator: ProxyApiCostCalculator) =>
  OpenAiImageModel({
    b64JsonResponse: false,
    cost: (totalTokens, size) => calculator.image(modelId, { size, totalTokens }),
    name: modelId,
  })(client);
