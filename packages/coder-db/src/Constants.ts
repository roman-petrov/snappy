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
    indexMaxPartitions: 32,
    /** Lower bound for IVF partitions once index building is enabled. */
    indexMinPartitions: 8,
    /** Target rows per one IVF partition. */
    indexRowsPerPartition: 512,
    /** Minimum row count before building the IVF-PQ vector index. */
    minRowsForVectorIndex: 512,
    /** IVF partitions to probe per query when an ANN index exists (`VectorQuery#nprobes`). */
    queryNprobes: 16,
    /** Row count per `add` batch in `VectorStore`. */
    rowsPerWriteBatch: 384,
  },
  /** Tool-level search defaults and output limits. */
  search: {
    /** Default nearest-neighbor count (`topK`). */
    defaultK: 18,
    /** Maximum accepted `topK` in tools. */
    maxK: 40,
    /** Truncate hit text previews to this many characters. */
    snippetMaxChars: 1200,
  },
};
