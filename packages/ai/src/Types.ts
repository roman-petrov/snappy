import type { AiConstants } from "./AiConstants";

export type AiAudioTranscriptionsCreateInput = { file: AiSpeechRecognitionInput; model: string };

export type AiChatAssistantMessage = { content: string; role: `assistant`; toolCalls?: AiChatToolCall[] };

export type AiChatCompletionCreateInput = (AiChatInput | { prompt: string }) & { model: string };

export type AiChatCompletionSession = { cost: () => Promise<number>; stream: AiChatStream };

export type AiChatInput = { messages: AiChatMessage[]; toolChoice?: AiChatToolChoice; tools?: AiChatTool[] };

export type AiChatMessage =
  | { content: string; role: `assistant`; toolCalls?: AiChatToolCall[] }
  | { content: string; role: `system` | `user` }
  | { content: string; role: `tool`; toolCallId: string };

export type AiChatStream = AsyncIterable<AiChatStreamChunk>;

export type AiChatStreamChunk =
  | { call: AiChatToolCall; type: `toolCall` }
  | { text: string; type: `text` }
  | { type: `textEnd` };

export type AiChatTool = { function: { description?: string; name: string; parameters: Record<string, unknown> } };

export type AiChatToolCall = { function: { arguments: unknown; name: string }; id: string };

export type AiChatToolChoice = `auto` | `none` | { name: string };

export type AiEmbeddingsCreateInput = { input: string | string[]; model: string };

export type AiImageGenerateInput = ImageGenerationOptions & { model: string; prompt: string };

export type AiImageQuality = (typeof AiConstants.imageQuality)[number];

export type AiImageSize = (typeof AiConstants.imageSize)[number];

export type AiLocale = `en` | `ru`;

export type AiModelListItem = { name: string; source: string; type: AiModelType };

export type AiModelType = `chat` | `embedder` | `image` | `speech-recognition`;

export type AiSpeechRecognitionInput = { bytes: Uint8Array; fileName: string; mimeType: string };

export type ImageGenerationOptions = { quality?: AiImageQuality; size: AiImageSize };
