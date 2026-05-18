/* eslint-disable @typescript-eslint/naming-convention */
import { _ } from "@snappy/core";

import type { AiEmbeddingsCreateInput } from "./Types";

import { AiCost } from "./AiCost";
import { AiHttp, type AiHttpConfig } from "./AiHttp";

type EmbeddingsResponse = { data: { embedding: number[] }[]; usage?: { cost_rub?: number } };

const create = async (http: AiHttpConfig, { input, model }: AiEmbeddingsCreateInput) => {
  const values = _.isArray(input) ? input : [input];
  const result = await AiHttp.postJson<EmbeddingsResponse>(http, `/embeddings`, { input: values, model });

  return { cost: AiCost.cost(result.usage), vectors: result.data.map(row => [...row.embedding]) };
};

export const AiEmbeddings = { create };
