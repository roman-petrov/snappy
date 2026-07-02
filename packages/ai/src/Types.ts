// cspell:word xhigh
import type { z } from "zod";

import type { AiConstants } from "./AiConstants";

export type AiChatAssistantMessage = {
  content: string;
  reasoningContent?: string;
  role: `assistant`;
  toolCalls?: AiToolCall[];
};

export type AiChatCompletionSession = {
  assistant: () => Promise<AiChatAssistantMessage>;
  chatText: (stop?: AiSessionStop) => AsyncIterable<string>;
  cost: () => Promise<number>;
  messages: () => Promise<AiChatMessage[]>;
  reasoningText: (stop?: AiSessionStop) => AsyncIterable<string>;
  stream: (stop?: AiSessionStop) => AiChatStream;
};

export type AiChatCompletionsInput = (AiChatInput | { prompt: string }) & { reasoningEffort?: AiReasoningEffort };

export type AiChatInput = { messages: AiChatMessage[]; toolChoice?: AiChatToolChoice; tools?: AiToolSet };

export type AiChatMessage =
  | { content: AiChatUserContent; role: `user` }
  | { content: string; reasoningContent?: string; role: `assistant`; toolCalls?: AiToolCall[] }
  | { content: string; role: `system` }
  | { content: string; role: `tool`; toolCallId: string };

export type AiChatStream = AsyncIterable<AiChatStreamSegment>;

export type AiChatStreamSegment =
  | { stream: AsyncIterable<AiToolCall>; type: `tool` }
  | { stream: AsyncIterable<string>; type: `chat` }
  | { stream: AsyncIterable<string>; type: `reasoning` };

export type AiChatToolChoice = `auto` | `none` | { name: string };

export type AiChatUserContent = AiContentPart[] | string;

export type AiContentPart = { text: string; type: `text` } | { type: `image`; url: string };

export type AiEmbedderInput = { input: string | string[] };

export type AiEmbedResult = { cost: number; vectors: number[][] };

export type AiImageAspectRatio =
  (typeof AiConstants.imageAspectRatio)[number] | (typeof AiConstants.imageAspectRatioExtended)[number];

export type AiImageBackground = `auto` | `opaque` | `transparent`;

export type AiImageBytesResult = { bytes: Uint8Array; cost: number };

export type AiImageConfig = AiImageFluxConfig | AiImageGeminiConfig;

export type AiImageConfigKind = `flux` | `gemini` | `gpt`;

export type AiImageEditInput = ImageEditOptions & { images: File[]; prompt: string };

export type AiImageFluxConfig = { height: number; width: number };

export type AiImageGeminiConfig = { aspectRatio: AiImageAspectRatio; resolution?: AiImageResolution };

export type AiImageGenerateInput = ImageGenerationOptions & { prompt: string };

export type AiImageQuality = (typeof AiConstants.imageQuality)[number];

export type AiImageResolution = (typeof AiConstants.imageResolution)[number];

export type AiImageSize = (typeof AiConstants.imageSizePreset)[keyof typeof AiConstants.imageSizePreset][number];

export type AiModality = `audio` | `embeddings` | `image` | `text`;

export type AiModelCapabilities = { input: readonly AiModality[]; output: readonly AiModality[] };

export type AiModelItem = { capabilities: AiModelCapabilities; name: string; source: `ai-tunnel`; type: AiModelType };

export type AiModelType = `chat` | `embedder` | `image` | `speech-recognition`;

export type AiReasoningEffort = `high` | `low` | `medium` | `minimal` | `none` | `xhigh`;

export type AiSessionStop = () => boolean;

export type AiSpeechTranscribeInput = { file: File };

export type AiSpeechTranscribeResult = { cost: number; text: string };

export type AiTool<INPUT = unknown> = {
  description: string;
  execute: (args: INPUT) => Promise<AiToolRunResult>;
  inputSchema: z.ZodType<INPUT>;
};

export type AiToolCall = { argumentsJson: string; toolCallId: string; toolName: string };

export type AiToolInput<T extends AiTool> = T extends AiTool<infer INPUT> ? INPUT : never;

export type AiToolRunResult = string | { context?: readonly AiContentPart[]; tool: string } | { error: string };

export type AiToolSet = Record<string, AiTool>;

export type ImageEditOptions = {
  background?: AiImageBackground;
  imageConfig?: AiImageConfig;
  quality?: AiImageQuality;
  size?: AiImageSize;
};

export type ImageGenerationOptions = { imageConfig?: AiImageConfig; quality?: AiImageQuality; size?: AiImageSize };
