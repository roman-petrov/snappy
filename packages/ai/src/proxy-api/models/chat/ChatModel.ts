import type openai from "openai";

import type { ProxyApiChatCostModelId, ProxyApiCostCalculator } from "../../ProxyApiCostCalculator";

import { OpenAiChatModel } from "../../core";

export const ChatModel =
  (modelId: ProxyApiChatCostModelId, calculator: ProxyApiCostCalculator) => (client: InstanceType<typeof openai>) =>
    OpenAiChatModel({
      cost: (promptTok, completionTok) => calculator.chat(modelId, { completionTok, promptTok }),
      name: modelId,
    })(client);
