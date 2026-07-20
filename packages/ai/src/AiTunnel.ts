// cspell:word aitunnel kimi moonshotai
import { _ } from "@snappy/core";

const baseUrlDefault = _.https(`api.aitunnel.ru/v1`);
const baseUrl = (path?: string) => (path === undefined ? baseUrlDefault : path.replace(/\/$/u, ``));

const chatModelId = (model: string) => {
  const slash = model.indexOf(`/`);

  return slash === -1 ? model : model.slice(slash + 1);
};

/** https://docs.aitunnel.ru/api/openrouter.html — chat/completions with `provider/model`. */
const openRouterProviders = [
  [`gpt-`, `openai`],
  [`claude-`, `anthropic`],
  [`gemini-`, `google`],
  [`deepseek-`, `deepseek`],
  [`qwen`, `qwen`],
  [`grok-`, `x-ai`],
  [`kimi-`, `moonshotai`],
  [`glm-`, `z-ai`],
] as const;

const openRouterChatModel = (model: string) => {
  const id = chatModelId(model);
  const provider = openRouterProviders.find(([prefix]) => id.startsWith(prefix))?.[1];

  return provider === undefined ? id : `${provider}/${id}`;
};

export const AiTunnel = { baseUrl, baseUrlDefault, chatModelId, openRouterChatModel };
