import {
  AiModelChatCatalog,
  AiModelDeepseekV4Flash,
  AiModelEmbedderCatalog,
  AiModelGemini35Flash,
  AiModelGpt4oMiniTranscribe,
  AiModelGptImage1Mini,
  AiModelImageCatalog,
  AiModelSpeechCatalog,
  AiModelTextEmbedding3Small,
} from "./models";

const items = [...AiModelChatCatalog, ...AiModelEmbedderCatalog, ...AiModelImageCatalog, ...AiModelSpeechCatalog].map(
  ({ capabilities, name, source, type }) => ({ capabilities, name, source, type }),
);

const fallback = {
  chat: AiModelDeepseekV4Flash,
  embedder: AiModelTextEmbedding3Small,
  image: AiModelGptImage1Mini,
  speechRecognition: AiModelGpt4oMiniTranscribe,
  vision: AiModelGemini35Flash,
} as const;

export const AiModels = { fallback, items };
