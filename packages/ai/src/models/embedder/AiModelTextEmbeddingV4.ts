// cspell:disable
import { ModelEmbedder } from "../../core-model";

export const AiModelTextEmbeddingV4 = ModelEmbedder({
  capabilities: { input: [`text`], output: [`embeddings`] },
  name: `text-embedding-v4`,
});
