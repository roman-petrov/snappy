/* eslint-disable unicorn/filename-case */
/* eslint-disable @typescript-eslint/naming-convention */
import type openai from "openai";

import type { ProxyApiCostCalculator } from "../../ProxyApiCostCalculator";

import { OpenAiChatModel } from "../../core";

const modelId = `gpt-5.4-mini`;

export const Gpt_5_4_Mini = (client: InstanceType<typeof openai>, calculator: ProxyApiCostCalculator) =>
  OpenAiChatModel({
    cost: (promptTok, completionTok) => calculator.chat(modelId, { completionTok, promptTok }),
    name: modelId,
  })(client);
