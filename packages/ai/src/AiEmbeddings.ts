/* eslint-disable @typescript-eslint/naming-convention */
import { _ } from "@snappy/core";

import type { CatalogEmbedder } from "./core-model/ModelEmbedder";
import type { AiEmbedderInput, AiEmbedResult } from "./Types";

import { AiCost } from "./AiCost";
import { AiHttp, type AiHttpConfig } from "./AiHttp";

type EmbeddingsResponse = { data: { embedding: number[] }[]; usage?: { cost_rub?: number } };

const create = async (
  http: AiHttpConfig,
  catalog: CatalogEmbedder,
  { input }: AiEmbedderInput,
): Promise<AiEmbedResult> => {
  const values = _.isArray(input) ? input : [input];
  const result = await AiHttp.postJson<EmbeddingsResponse>(http, `/embeddings`, { input: values, model: catalog.name });

  return { cost: AiCost.cost(result.usage), vectors: result.data.map(row => [...row.embedding]) };
};

export const AiEmbeddings = { create };
