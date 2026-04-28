// cspell:word nprobes
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { _ } from "@snappy/core";

export const Constants = {
  /** Batching calls to the embedding model inside `Indexer`. */
  embedding: {
    /** Chunks per one model request batch. */
    batchChunkCount: 1536,
    /** Upper bound on total characters in one request batch. */
    maxInputChars: 160_000,
    /** Concurrent model request workers. */
    maxParallelRequests: 12,
  },
  /** Indexer pipeline: file limits, back-pressure, manifest persistence. */
  indexing: {
    /** Maximum input file size, in bytes. */
    maxFileBytes: _.kb(512),
    /** Max queued path write jobs before producers wait. */
    maxPendingWrites: 64,
    /** Persist manifest after this many completed Lance write batches. */
    writesUntilManifestFlush: 16,
  },
  /** LanceDB table writes, ANN index, and vector query tuning. */
  lanceDb: {
    /** Multiplier for coalesced write flush size in replace flow. */
    coalescedWriteMultiplier: 16,
    /** Hard cap for IVF partitions to avoid many empty buckets on medium datasets. */
    indexMaxPartitions: 64,
    /** Lower bound for IVF partitions once index building is enabled. */
    indexMinPartitions: 8,
    /** Target rows per one IVF partition. */
    indexRowsPerPartition: 384,
    /** Minimum row count before building the IVF-PQ vector index. */
    minRowsForVectorIndex: 2048,
    /** IVF partitions to probe per query when an ANN index exists (`VectorQuery#nprobes`). */
    queryNprobes: 32,
    /** Row count per `add` batch in `VectorStore`. */
    rowsPerWriteBatch: 384,
  },
  /** Tool-level search defaults and output limits. */
  search: {
    /** Max snippet length used to build candidate embeddings. */
    candidateSnippetMaxChars: 1200,
    /** Penalty for candidates contradicted by nearest neighbors. */
    contradictionWeight: 0.18,
    /** Default nearest-neighbor count (`topK`). */
    defaultK: 18,
    /** Penalty applied to weaker ANN hits via distance field. */
    distancePenalty: 0.24,
    /** Number of neighbors used to estimate cross-source evidence support. */
    evidenceK: 12,
    /** Similarity floor after which a neighbor counts as support evidence. */
    evidenceSimilarityFloor: 0.62,
    /** Weight of cross-candidate support in final rerank score. */
    evidenceWeight: 0.7,
    /** Wider retrieval expansion multiplier for the optional second pass. */
    fallbackFetchMultiplier: 18,
    /** Retrieval expansion multiplier before consensus ranking. */
    fetchMultiplier: 8,
    /** Upper bound for retrieved candidates before clustering. */
    maxCandidates: 320,
    /** Upper bound for retrieved candidates in the second pass. */
    maxCandidatesFallback: 640,
    /** Maximum accepted `topK` in tools. */
    maxK: 40,
    /** Max hits from the same directory in final topK. */
    maxPerDir: 3,
    /** Max hits from the same file in final topK. */
    maxPerFile: 2,
    /** Tradeoff between relevance and novelty in MMR (`0..1`). */
    mmrLambda: 0.74,
    /** Strength of novelty pressure in MMR term. */
    mmrRedundancyWeight: 0.85,
    /** Weight of query similarity in relevance term. */
    querySimilarityWeight: 1,
    /** Truncate hit text previews to this many characters. */
    snippetMaxChars: 1200,
  },
};
