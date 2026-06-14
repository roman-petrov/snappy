// cspell:disable
import { ModelEmbedder } from "../../core-model";

export const AiModelQwen3Embedding8b = ModelEmbedder({
  capabilities: { input: [`text`], output: [`embeddings`] },
  name: `qwen3-embedding-8b`,
});
