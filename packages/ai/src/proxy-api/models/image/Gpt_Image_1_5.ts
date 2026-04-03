/* eslint-disable unicorn/filename-case */
/* eslint-disable @typescript-eslint/naming-convention */
import type openai from "openai";

import type { ProxyApiCostCalculator } from "../../ProxyApiCostCalculator";

import { OpenAiImageModel } from "../../core";

const modelId = `gpt-image-1.5`;

export const Gpt_Image_1_5 = (client: InstanceType<typeof openai>, calculator: ProxyApiCostCalculator) =>
  OpenAiImageModel({
    b64JsonResponse: false,
    cost: (totalTokens, size) => calculator.image(modelId, { size, totalTokens }),
    name: modelId,
  })(client);
