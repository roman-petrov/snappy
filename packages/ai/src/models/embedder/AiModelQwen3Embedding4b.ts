// cspell:disable
import { ModelEmbedder } from "../../core-model";

export const AiModelQwen3Embedding4b = ModelEmbedder({
  capabilities: { input: [`text`], output: [`embeddings`] },
  name: `qwen3-embedding-4b`,
});
