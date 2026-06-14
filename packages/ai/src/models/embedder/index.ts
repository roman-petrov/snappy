import { AiModelCodestralEmbed2505 } from "./AiModelCodestralEmbed2505";
import { AiModelGeminiEmbedding001 } from "./AiModelGeminiEmbedding001";
import { AiModelQwen3Embedding4b } from "./AiModelQwen3Embedding4b";
import { AiModelQwen3Embedding8b } from "./AiModelQwen3Embedding8b";
import { AiModelTextEmbedding3Large } from "./AiModelTextEmbedding3Large";
import { AiModelTextEmbedding3Small } from "./AiModelTextEmbedding3Small";
import { AiModelTextEmbeddingV4 } from "./AiModelTextEmbeddingV4";

export * from "./AiModelCodestralEmbed2505";

export * from "./AiModelGeminiEmbedding001";

export * from "./AiModelQwen3Embedding4b";

export * from "./AiModelQwen3Embedding8b";

export * from "./AiModelTextEmbedding3Large";

export * from "./AiModelTextEmbedding3Small";

export * from "./AiModelTextEmbeddingV4";

export const AiModelEmbedderCatalog = [
  AiModelCodestralEmbed2505,
  AiModelGeminiEmbedding001,
  AiModelQwen3Embedding4b,
  AiModelQwen3Embedding8b,
  AiModelTextEmbedding3Large,
  AiModelTextEmbedding3Small,
  AiModelTextEmbeddingV4,
] as const;
