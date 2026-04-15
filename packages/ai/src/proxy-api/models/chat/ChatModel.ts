import type { OpenAI } from "openai";

import type { ProxyApiChatCostModelId, ProxyApiCostCalculator } from "../../ProxyApiCostCalculator";

import { OpenAiChatModel } from "../../core";

export const ChatModel = (modelId: ProxyApiChatCostModelId, calculator: ProxyApiCostCalculator) => (client: OpenAI) =>
  OpenAiChatModel({
    cost: (promptTok, completionTok) => calculator.chat(modelId, { completionTok, promptTok }),
    name: modelId,
  })(client);
