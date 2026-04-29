// cspell:word xhigh
import type { z } from "zod";

import type { AiConstants } from "./AiConstants";

export type AiAudioTranscriptionsCreateInput = { file: AiSpeechRecognitionInput; model: string };

export type AiChatAssistantMessage = { content: string; role: `assistant`; toolCalls?: AiToolCall[] };

export type AiChatCompletionCreateInput = (AiChatInput | { prompt: string }) & {
  model: string;
  reasoningEffort?: AiReasoningEffort;
};

export type AiChatCompletionSession = {
  assistant: () => Promise<AiChatAssistantMessage>;
  chatText: (stop?: AiSessionStop) => AsyncIterable<string>;
  cost: () => Promise<number>;
  messages: () => Promise<AiChatMessage[]>;
  reasoningText: (stop?: AiSessionStop) => AsyncIterable<string>;
  stream: (stop?: AiSessionStop) => AiChatStream;
};

export type AiChatInput = { messages: AiChatMessage[]; toolChoice?: AiChatToolChoice; tools?: AiToolSet };

export type AiChatMessage =
  | { content: string; role: `assistant`; toolCalls?: AiToolCall[] }
  | { content: string; role: `system` | `user` }
  | { content: string; role: `tool`; toolCallId: string };

export type AiChatStream = AsyncIterable<AiChatStreamSegment>;

export type AiChatStreamSegment =
  | { stream: AsyncIterable<AiToolCall>; type: `tool` }
  | { stream: AsyncIterable<string>; type: `chat` }
  | { stream: AsyncIterable<string>; type: `reasoning` };

export type AiChatToolChoice = `auto` | `none` | { name: string };

export type AiEmbeddingsCreateInput = { input: string | string[]; model: string };

export type AiImageGenerateInput = ImageGenerationOptions & { model: string; prompt: string };

export type AiImageQuality = (typeof AiConstants.imageQuality)[number];

export type AiImageSize = (typeof AiConstants.imageSize)[number];

export type AiModelListItem = { name: string; source: string; type: AiModelType };

export type AiModelType = `chat` | `embedder` | `image` | `speech-recognition`;

export type AiReasoningEffort = `high` | `low` | `medium` | `minimal` | `none` | `xhigh`;

export type AiSessionStop = () => boolean;

export type AiSpeechRecognitionInput = { bytes: Uint8Array; fileName: string; mimeType: string };

export type AiTool<INPUT = unknown> = {
  description: string;
  execute: (args: INPUT) => Promise<AiToolRunResult>;
  inputSchema: z.ZodType<INPUT>;
};

export type AiToolCall = { input: unknown; toolCallId: string; toolName: string };

export type AiToolInput<T extends AiTool> = T extends AiTool<infer INPUT> ? INPUT : never;

export type AiToolRunResult = string | { error: string };

export type AiToolSet = Record<string, AiTool>;

export type ImageGenerationOptions = { quality?: AiImageQuality; size: AiImageSize };
