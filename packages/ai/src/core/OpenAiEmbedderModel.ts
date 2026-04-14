import type { OpenAI } from "openai";
import type { CreateEmbeddingResponse } from "openai/resources/embeddings";

import type { AiGenericEmbedderModel } from "../Types";

export type OpenAiEmbedderModelConfig = { cost: (usage: OpenAiEmbedderUsage | undefined) => number; name: string };

export type OpenAiEmbedderUsage = CreateEmbeddingResponse[`usage`];

export const OpenAiEmbedderModel =
  ({ cost, name }: OpenAiEmbedderModelConfig) =>
  (client: OpenAI): AiGenericEmbedderModel => {
    const process: AiGenericEmbedderModel[`process`] = async input => {
      const { data, usage } = await client.embeddings.create({ input, model: name });
      const vectors = data.map(entry => entry.embedding);

      return { cost: cost(usage), vectors };
    };

    return { name, process, type: `embedder` };
  };
