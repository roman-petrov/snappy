export { AiConstants } from "./AiConstants";

import type { AiConstants } from "./AiConstants";

export type AiImageQuality = (typeof AiConstants.imageQuality)[number];

export type AiImageSize = (typeof AiConstants.imageSize)[number];

export type ImageGenerationOptions = { quality?: AiImageQuality; size: AiImageSize };

export const AiErrors = { unavailable: `llmUnavailable` } as const;

export type AiChatModel = { name: string; process: (prompt: string) => Promise<AiChatResult>; type: `chat` };

export type AiChatResult = { cost: number; text: string };

export type AiImageModel = {
  name: string;
  process: (prompt: string, options: ImageGenerationOptions) => Promise<AiImageResult>;
  type: `image`;
};

export type AiImageResult = { bytes: Uint8Array; cost: number };

export type AiModel = (AiChatModel | AiImageModel | AiSpeechRecognitionModel) & { source: string };

export type AiModelType = AiModel[`type`];

export type AiSpeechRecognitionInput = { bytes: Uint8Array; fileName: string; mimeType: string };

export type AiSpeechRecognitionModel = {
  name: string;
  process: (input: AiSpeechRecognitionInput) => Promise<AiSpeechResult>;
  type: `speech-recognition`;
};

export type AiSpeechResult = { cost: number; text: string };
