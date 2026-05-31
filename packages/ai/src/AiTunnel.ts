import type { AiReasoning } from "./AiApi";
import type { AiReasoningEffort } from "./Types";

const baseUrlDefault = `https://api.aitunnel.ru/v1`;
const baseUrl = (path?: string) => (path === undefined ? baseUrlDefault : path.replace(/\/$/u, ``));

/** Strip OpenRouter `provider/` prefix; package stores short ids (`gpt-5-mini`). */
const chatModelId = (model: string) => {
  const slash = model.indexOf(`/`);

  return slash === -1 ? model : model.slice(slash + 1);
};

/** https://docs.aitunnel.ru/api/openrouter.html — chat/completions with `provider/model`. */
const openRouterChatModel = (model: string) => {
  const id = chatModelId(model);

  const provider = id.startsWith(`gpt-`)
    ? `openai`
    : id.startsWith(`claude-`)
      ? `anthropic`
      : id.startsWith(`gemini-`)
        ? `google`
        : id.startsWith(`deepseek-`)
          ? `deepseek`
          : id.startsWith(`qwen`)
            ? `qwen`
            : id.startsWith(`grok-`)
              ? `x-ai`
              : undefined;

  return provider === undefined ? id : `${provider}/${id}`;
};

/**
 * OpenRouter: `effort: "none"` disables reasoning; `exclude: true` only hides it (still slow).
 * @see https://openrouter.ai/docs/guides/best-practices/reasoning-tokens
 */
const reasoningBody = (effort: AiReasoningEffort | undefined): AiReasoning => ({
  effort: effort === undefined || effort === `none` ? `none` : effort,
});

export const AiTunnel = { baseUrl, baseUrlDefault, chatModelId, openRouterChatModel, reasoningBody };
