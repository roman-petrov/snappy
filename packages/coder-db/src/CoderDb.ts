/* eslint-disable functional/no-expression-statements */
import { Constants } from "./Constants";
import { Reranker } from "./core/Reranker";
import { Indexer, type IndexerConfig, SemanticSearch, VectorStore } from "./tools";

export type CoderDbConfig = Pick<IndexerConfig, `aiEmbeddings` | `dbDir` | `embeddingModel` | `ignore` | `projectRoot`>;

export const CoderDb = async ({ aiEmbeddings, dbDir, embeddingModel, ignore, projectRoot }: CoderDbConfig) => {
  const store = await VectorStore(dbDir);
  const sync = Indexer({ aiEmbeddings, dbDir, embeddingModel, ignore, projectRoot, store });

  const search = async ({ query, topK = Constants.search.defaultK }: { query: string; topK?: number }) => {
    await sync();

    const [vector] = (await aiEmbeddings.create({ input: query, model: embeddingModel })).vectors;
    if (vector === undefined) {
      return { kind: `no_results` as const };
    }

    const safeTopK = Math.max(0, topK);

    const { candidateSnippetMaxChars, fallbackFetchMultiplier, fetchMultiplier, maxCandidates, maxCandidatesFallback } =
      Constants.search;

    const retrieveLimit = Math.min(maxCandidates, Math.max(safeTopK, safeTopK * fetchMultiplier));

    const primaryCandidates = await store.search(vector, {
      limit: retrieveLimit,
      nprobes: Constants.lanceDb.queryNprobes,
    });

    const fallbackRetrieveLimit = Math.min(
      maxCandidatesFallback,
      Math.max(safeTopK, safeTopK * fallbackFetchMultiplier),
    );

    const fallbackNprobes = Constants.lanceDb.queryNprobes * 2;
    const shouldRunFallback = fallbackRetrieveLimit > retrieveLimit || fallbackNprobes > Constants.lanceDb.queryNprobes;

    const fallbackCandidates = shouldRunFallback
      ? await store.search(vector, { limit: fallbackRetrieveLimit, nprobes: fallbackNprobes })
      : [];

    const mergedCandidates = [...primaryCandidates, ...fallbackCandidates];

    if (mergedCandidates.length <= 1) {
      const hits = mergedCandidates.slice(0, safeTopK);

      return hits.length === 0 ? { kind: `no_results` as const } : { hits, kind: `hits` as const };
    }

    const snippets = mergedCandidates.map(candidate => candidate.text.slice(0, candidateSnippetMaxChars));
    const { vectors } = await aiEmbeddings.create({ input: snippets, model: embeddingModel });

    const hits = Reranker.rerank({
      candidates: mergedCandidates,
      config: Constants.search,
      queryVector: vector,
      topK: safeTopK,
      vectors,
    });

    return hits.length === 0 ? { kind: `no_results` as const } : { hits, kind: `hits` as const };
  };

  const tools = { "coder-db": { "semantic-search": SemanticSearch({ search }) } } as const;

  return { close: store.close, sync, tools };
};

export type CoderDb = Awaited<ReturnType<typeof CoderDb>>;
