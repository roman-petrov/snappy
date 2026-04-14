import type { AiConstants } from "./AiConstants";

export type AiImageQuality = (typeof AiConstants.imageQuality)[number];

export type AiImageSize = (typeof AiConstants.imageSize)[number];

export type AiLocale = `en` | `ru`;

export type ImageGenerationOptions = { quality?: AiImageQuality; size: AiImageSize };

export const AiErrors = { unavailable: `llmUnavailable` } as const;

export type AiChatAssistantMessage = { content: string; role: `assistant`; toolCalls?: AiChatToolCall[] };

export type AiChatInput = { messages: AiChatMessage[]; toolChoice?: AiChatToolChoice; tools?: AiChatTool[] };

export type AiChatMessage =
  | { content: string; role: `assistant`; toolCalls?: AiChatToolCall[] }
  | { content: string; role: `system` | `user` }
  | { content: string; role: `tool`; toolCallId: string };

export type AiChatModel = {
  name: string;
  process: (prompt: AiChatInput | string) => Promise<AiChatProcessResult>;
  type: `chat`;
};

export type AiChatProcessResult = { done: Promise<AiChatStreamDone>; stream: AsyncIterable<string> };

export type AiChatStreamDone = { cost: number; message: AiChatAssistantMessage; text: string };

export type AiChatTool = { function: { description?: string; name: string; parameters: Record<string, unknown> } };

export type AiChatToolCall = { function: { arguments: string; name: string }; id: string };

export type AiChatToolChoice = `auto` | `none` | { name: string };

export type AiEmbedderModel = {
  name: string;
  process: (input: string | string[]) => Promise<AiEmbedderResult>;
  type: `embedder`;
};

export type AiEmbedderResult = { cost: number; vectors: number[][] };

export type AiGenericChatModel = Omit<AiChatModel, `source`>;

export type AiGenericEmbedderModel = Omit<AiEmbedderModel, `source`>;

export type AiGenericImageModel = Omit<AiImageModel, `source`>;

export type AiGenericModel =
  | AiGenericChatModel
  | AiGenericEmbedderModel
  | AiGenericImageModel
  | AiGenericSpeechRecognitionModel;

export type AiGenericSpeechRecognitionModel = Omit<AiSpeechRecognitionModel, `source`>;

export type AiImageModel = {
  name: string;
  process: (prompt: string, options: ImageGenerationOptions) => Promise<AiImageResult>;
  type: `image`;
};

export type AiImageResult = { bytes: Uint8Array; cost: number };

export type AiModel = (AiChatModel | AiEmbedderModel | AiImageModel | AiSpeechRecognitionModel) & { source: string };

export type AiModelProvider = (input: { apiKey?: string; baseUrl: string; locale: AiLocale }) => Promise<AiModel[]>;

export type AiModelType = AiModel[`type`];

export type AiSpeechRecognitionInput = { bytes: Uint8Array; fileName: string; mimeType: string };

export type AiSpeechRecognitionModel = {
  name: string;
  process: (input: AiSpeechRecognitionInput) => Promise<AiSpeechResult>;
  type: `speech-recognition`;
};

export type AiSpeechResult = { cost: number; text: string };
