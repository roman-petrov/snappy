import type { AiApiAssistantMessage, AiChatCompletionBody, AiReasoning } from "../AiApi";
import type { AiChatAssistantMessage, AiChatMessage } from "../Types";

import { AiModelDeepSeek } from "./AiModelDeepSeek";
import { AiModelDefault } from "./AiModelDefault";

export type AiModel = {
  assistantReasoningExtras: (reasoning: string) => Partial<Pick<AiChatAssistantMessage, `reasoningContent`>>;
  assistantToolCallsExtras: (
    message: Extract<AiChatMessage, { role: `assistant` }>,
  ) => Partial<Pick<AiApiAssistantMessage, `reasoning_content`>>;
  completionExtras: (reasoning: AiReasoning) => Partial<Pick<AiChatCompletionBody, `thinking`>>;
  matches: (model: string) => boolean;
  streamDelta: (delta: AiModelStreamDelta, sink: AiModelStreamSink) => void;
};

export type AiModelStreamDelta = {
  reasoning?: null | string;
  reasoningDetails?: { format?: string; index?: number; text?: string; type?: string }[];
};

export type AiModelStreamSink = {
  pushDetailsReasoning: (details: AiModelStreamDelta[`reasoningDetails`]) => void;
  pushPlainReasoning: (reasoning: AiModelStreamDelta[`reasoning`]) => boolean;
};

const catalog: readonly AiModel[] = [AiModelDeepSeek];
const resolve = (modelId: string): AiModel => catalog.find(entry => entry.matches(modelId)) ?? AiModelDefault;

export const AiModel = { resolve };
