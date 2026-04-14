/* eslint-disable functional/no-expression-statements */
import { Constants } from "./Constants";
import { Indexer, type IndexerConfig, SemanticSearch, VectorStore } from "./tools";

export type CoderDbConfig = Pick<IndexerConfig, `dbDir` | `embeddingModel` | `ignore` | `projectRoot`>;

export const CoderDb = async ({ dbDir, embeddingModel, ignore, projectRoot }: CoderDbConfig) => {
  const store = await VectorStore(dbDir);
  const sync = Indexer({ dbDir, embeddingModel, ignore, projectRoot, store });

  const search = async ({ query, topK = Constants.search.defaultK }: { query: string; topK?: number }) => {
    await sync();

    const [vector] = (await embeddingModel.process(query)).vectors;
    if (vector === undefined) {
      return { kind: `no_results` as const };
    }

    const hits = await store.search(vector, topK);
    if (hits.length === 0) {
      return { kind: `no_results` as const };
    }

    return { hits, kind: `hits` as const };
  };

  const tools = { "coder-db": { "semantic-search": SemanticSearch({ search }) } } as const;

  return { close: store.close, sync, tools };
};

export type CoderDb = Awaited<ReturnType<typeof CoderDb>>;
