export type AiImageSize = `256x256` | `512x512` | `1024x1024` | `1024x1792` | `1792x1024`;

export type ImageGenerationOptions = { size: AiImageSize };

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
