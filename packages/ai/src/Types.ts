import type { AiChatModel, AiImageModel, AiModel, AiSpeechRecognitionModel } from "@snappy/domain";

export type AiGenericChatModel = Omit<AiChatModel, `source`>;

export type AiGenericImageModel = Omit<AiImageModel, `source`>;

export type AiGenericModel = AiGenericChatModel | AiGenericImageModel | AiGenericSpeechRecognitionModel;

export type AiGenericSpeechRecognitionModel = Omit<AiSpeechRecognitionModel, `source`>;

export type AiModelProvider = (apiKey: string, priceMultiplier: number) => AiModel[];
