// cspell:disable
import { ModelEmbedder } from "../../core-model";

export const AiModelTextEmbedding3Large = ModelEmbedder({
  capabilities: { input: [`text`], output: [`embeddings`] },
  name: `text-embedding-3-large`,
});
