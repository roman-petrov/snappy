import type { AiHttpConfig } from "../AiHttp";
import type { AiEmbedderInput, AiEmbedResult, AiModelCapabilities } from "../Types";
import type { AiModelEntry } from "./Entry";

import { AiEmbeddings } from "../AiEmbeddings";
import { ModelEntry } from "./ModelEntry";

export type AiEmbedderModel = CatalogEmbedder & { embed: (input: AiEmbedderInput) => Promise<AiEmbedResult> };

export type CatalogEmbedder = AiModelEntry & { type: `embedder` };

export const ModelEmbedder = (props: {
  capabilities: AiModelCapabilities;
  name: string;
}): CatalogEmbedder & { of: (http: AiHttpConfig) => AiEmbedderModel } =>
  ModelEntry.bind(`embedder`, props, (http, catalog) => ({
    ...catalog,
    embed: async input => AiEmbeddings.create(http, catalog, input),
  }));
