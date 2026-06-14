import { AiModelGpt4oMiniTranscribe } from "./AiModelGpt4oMiniTranscribe";
import { AiModelGpt4oTranscribe } from "./AiModelGpt4oTranscribe";

export * from "./AiModelGpt4oMiniTranscribe";

export * from "./AiModelGpt4oTranscribe";

export const AiModelSpeechCatalog = [AiModelGpt4oMiniTranscribe, AiModelGpt4oTranscribe] as const;
