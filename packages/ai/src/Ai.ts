import { ProxyApi } from "./proxy-api";

const maxImagePromptLength = 3000;
const maxSpeechFileMegaBytes = 25;

export const Ai = (proxyApiKey: string, llmDebitPriceMultiplier: number) => ({
  maxImagePromptLength,
  maxSpeechFileMegaBytes,
  models: ProxyApi(proxyApiKey, llmDebitPriceMultiplier),
});
