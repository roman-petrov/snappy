// cspell:disable
import { ModelEmbedder } from "../../core-model";

export const AiModelGeminiEmbedding2 = ModelEmbedder({
  capabilities: { input: [`text`], output: [`embeddings`] },
  name: `gemini-embedding-2`,
});
