/* eslint-disable functional/immutable-data */
// cspell:word nprobes
/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable require-atomic-updates */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import { connect, Index, type Table } from "@lancedb/lancedb";
import { _ } from "@snappy/core";
import { z } from "zod";

import { Constants } from "../Constants";

const chunkColumnsSchema = z.object({
  chunkIndex: z.number(),
  digest: z.string(),
  endLine: z.number(),
  path: z.string(),
  startLine: z.number(),
  text: z.string(),
});

export type ReplaceWriteJob = { path: string; rows: VectorStoreChunk[] };

export type VectorSearchOptions = { limit: number; nprobes?: number };

export type VectorSearchRow = VectorStoreChunkColumns & { distance?: number };

export type VectorStoreChunk = VectorStoreChunkColumns & { vector: number[] };

export type VectorStoreChunkColumns = z.infer<typeof chunkColumnsSchema>;

export const VectorStore = async (uri: string) => {
  const preferredWriteRowsPerFlush = Math.max(
    Constants.lanceDb.rowsPerWriteBatch,
    Constants.lanceDb.rowsPerWriteBatch * Constants.lanceDb.coalescedWriteMultiplier,
  );

  const tableName = `code_chunks` as const;
  const connection = await connect(uri);
  let table = undefined as Table | undefined;
  const haveTable = async () => (await connection.tableNames()).includes(tableName);

  if (await haveTable()) {
    table = await connection.openTable(tableName);
  }

  const addRows = async (rows: VectorStoreChunk[]) => {
    if (rows.length === 0) {
      return;
    }
    const batchSize = Constants.lanceDb.rowsPerWriteBatch;
    for (let start = 0; start < rows.length; start += batchSize) {
      const batch = rows.slice(start, start + batchSize);
      if (table === undefined) {
        const [seed, ...rest] = batch;
        if (seed === undefined) {
          return;
        }
        table = await connection.createTable(tableName, [seed], { existOk: false, mode: `create` });
        if (rest.length > 0) {
          await table.add(rest);
        }
        continue;
      }
      await table.add(batch);
    }
  };

  const add = async (rows: VectorStoreChunk[]) => {
    await addRows(rows);
  };

  const close = () => connection.close();

  const remove = async (relativePath: string) => {
    if (table === undefined) {
      return;
    }
    await table.delete(`path = '${relativePath.replaceAll(`'`, `''`)}'`);
  };

  const clean = async () => {
    if (await haveTable()) {
      await connection.dropTable(tableName);
    }
    table = undefined;
  };

  const replace = async <T>(
    paths: string[],
    run: (write: (jobs: ReplaceWriteJob[]) => Promise<void>) => Promise<T>,
  ) => {
    const preparedPaths = new Set<string>();
    let buffer: VectorStoreChunk[] = [];

    for (const relativePath of new Set(paths)) {
      await remove(relativePath);
      preparedPaths.add(relativePath);
    }

    const flush = async () => {
      if (buffer.length === 0) {
        return;
      }
      await addRows(buffer);
      buffer = [];
    };

    const write = async (jobs: ReplaceWriteJob[]) => {
      for (const job of jobs) {
        if (!preparedPaths.has(job.path)) {
          await remove(job.path);
          preparedPaths.add(job.path);
        }
        buffer.push(...job.rows);
        if (buffer.length >= preferredWriteRowsPerFlush) {
          await flush();
        }
      }
    };

    const result = await run(write);
    await flush();

    return result;
  };

  const search = async (vector: number[], { limit, nprobes = Constants.lanceDb.queryNprobes }: VectorSearchOptions) => {
    if (table === undefined) {
      return [];
    }

    return (
      (await table
        .vectorSearch(vector)
        .select([..._.keys(chunkColumnsSchema.shape), `_distance`])
        .nprobes(nprobes)
        .limit(limit)
        .toArray()) as (VectorStoreChunkColumns & { _distance?: number })[]
    ).map(({ _distance: distance, ...hit }) => ({ ...hit, distance }));
  };

  const reindex = async () => {
    if (table === undefined) {
      return;
    }

    const rowCount = await table.countRows();
    if (rowCount < Constants.lanceDb.minRowsForVectorIndex) {
      return;
    }

    if ((await table.listIndices()).some(index => index.name === `vector_idx` || index.columns.includes(`vector`))) {
      await table.optimize();

      return;
    }

    const numberPartitions = Math.max(
      Constants.lanceDb.indexMinPartitions,
      Math.min(Constants.lanceDb.indexMaxPartitions, Math.floor(rowCount / Constants.lanceDb.indexRowsPerPartition)),
    );
    await table.createIndex(`vector`, { config: Index.ivfPq({ numPartitions: numberPartitions }) });
  };

  return { add, clean, close, reindex, remove, replace, search };
};

export type VectorStore = Awaited<ReturnType<typeof VectorStore>>;
