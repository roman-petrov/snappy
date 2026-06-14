import type { AiApiAssistantMessage, AiChatCompletionBody, AiReasoning } from "../AiApi";
import type { AiChatAssistantMessage, AiChatMessage, AiModelListItem } from "../Types";

export type AiModelBehavior = {
  assistantReasoningExtras: (reasoning: string) => Partial<Pick<AiChatAssistantMessage, `reasoningContent`>>;
  assistantToolCallsExtras: (
    message: Extract<AiChatMessage, { role: `assistant` }>,
  ) => Partial<Pick<AiApiAssistantMessage, `reasoning_content`>>;
  completionExtras: (reasoning: AiReasoning) => Partial<Pick<AiChatCompletionBody, `thinking`>>;
  streamDelta: (delta: AiModelStreamDelta, sink: AiModelStreamSink) => void;
};

export type AiModelEntry = AiModelBehavior & AiModelListItem & { matches: (modelId: string) => boolean };

export type AiModelStreamDelta = {
  reasoning?: null | string;
  reasoningDetails?: { format?: string; index?: number; text?: string; type?: string }[];
};

export type AiModelStreamSink = {
  pushDetailsReasoning: (details: AiModelStreamDelta[`reasoningDetails`]) => void;
  pushPlainReasoning: (reasoning: AiModelStreamDelta[`reasoning`]) => boolean;
};
