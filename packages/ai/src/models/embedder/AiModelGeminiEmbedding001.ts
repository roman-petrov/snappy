// cspell:disable
import { ModelEmbedder } from "../../core-model";

export const AiModelGeminiEmbedding001 = ModelEmbedder({
  capabilities: { input: [`text`], output: [`embeddings`] },
  name: `gemini-embedding-001`,
});
