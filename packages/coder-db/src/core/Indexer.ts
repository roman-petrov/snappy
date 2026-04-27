/* eslint-disable init-declarations */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-continue */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-try-statements */
/* eslint-disable functional/no-promise-reject */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/only-throw-error */
import type { AiModel } from "@snappy/ai";

import { CoderChunk } from "@snappy/coder-chunk";
import { _, type Action, Json } from "@snappy/core";
import { createHash } from "node:crypto";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

import type { CoderIgnore } from "./CoderIgnore";
import type { VectorStore, VectorStoreChunk } from "./VectorStore";

import { Constants } from "../Constants";

const manifestFileName = `coder-index-manifest.json` as const;
const hashUtf8 = (text: string) => createHash(`sha256`).update(text, `utf8`).digest(`hex`);
const manifestAbsolutePath = (dbDir: string) => path.join(dbDir, manifestFileName);

export type IndexerConfig = {
  dbDir: string;
  embeddingModel: Extract<AiModel, { type: `embedder` }>;
  ignore: CoderIgnore;
  projectRoot: string;
  store: VectorStore;
};

export type IndexProgress =
  | { chunkCount: number; filesIndexed: number; filesSkippedUnchanged: number; filesTotal: number; kind: `done` }
  | { filesDone: number; filesTotal: number; kind: `file`; path: string };

export type SyncOptions = { onProgress?: (progress: IndexProgress) => void };

export type SyncResult = {
  chunkTotal: number;
  filesIndexed: number;
  filesSkipped: string[];
  filesSkippedUnchanged: number;
};

type EmbeddedBatch = { path: string; rows: VectorStoreChunk[]; totalChunks: number };

type IndexedJob = { chunks: ReturnType<typeof CoderChunk.build>; digest: string; path: string; totalChunks: number };

type IndexManifestRecord = Record<string, ManifestEntry>;

type IndexManifestState = { embeddingModelName?: string; files: IndexManifestRecord };

type ManifestEntry = { sha256: string };

type QueueItem = {
  chunk: ReturnType<typeof CoderChunk.build>[number];
  digest: string;
  path: string;
  totalChunks: number;
};

type WriteJob = EmbeddedBatch & { digest: string };

const loadManifest = async (dbDir: string) => {
  try {
    return Json.parse<IndexManifestState>(await readFile(manifestAbsolutePath(dbDir), `utf8`));
  } catch {
    return { files: {} };
  }
};

const saveManifest = async (dbDir: string, manifest: IndexManifestState) => {
  await mkdir(dbDir, { recursive: true });
  await writeFile(manifestAbsolutePath(dbDir), Json.stringify(manifest), `utf8`);
};

const toQueue = (jobs: IndexedJob[]): QueueItem[] =>
  jobs.flatMap(job =>
    job.chunks.map(chunk => ({ chunk, digest: job.digest, path: job.path, totalChunks: job.totalChunks })),
  );

const takeBatch = (queue: QueueItem[], start: number, batchChunkCount: number) => {
  const maxByChunks = Math.min(queue.length, start + batchChunkCount);
  let totalChars = 0;
  let end = start;

  while (end < maxByChunks) {
    const item = queue[end];
    if (item === undefined) {
      break;
    }

    const nextTotalChars = totalChars + item.chunk.text.length;
    if (end > start && nextTotalChars > Constants.embedding.maxInputChars) {
      break;
    }

    totalChars = nextTotalChars;
    end += 1;
  }

  return queue.slice(start, end);
};

export const Indexer =
  ({ dbDir, embeddingModel, ignore, projectRoot, store }: IndexerConfig) =>
  async ({ onProgress }: SyncOptions = {}) => {
    const paths = await ignore.list({ cwd: projectRoot }).then(list => list.toSorted());
    const pathsSet = new Set(paths);
    const loadedManifest = await loadManifest(dbDir);
    let manifest: IndexManifestRecord = loadedManifest.files;
    if (loadedManifest.embeddingModelName !== embeddingModel.name) {
      await store.clean();
      manifest = {};
      await saveManifest(dbDir, { embeddingModelName: embeddingModel.name, files: manifest });
    }

    let lanceNeedsReindex = false;

    for (const key of _.keys(manifest)) {
      if (!pathsSet.has(key)) {
        await store.remove(key);
        lanceNeedsReindex = true;
      }
    }

    manifest = _.fromEntries(_.entries(manifest).filter(([pathKey]) => pathsSet.has(pathKey)));
    const changedJobs: IndexedJob[] = [];
    const filesTotal = paths.length;
    let filesSkippedUnchanged = 0;
    const filesSkipped: string[] = [];
    for (const relativePath of paths) {
      const abs = path.join(projectRoot, relativePath.split(`/`).join(path.sep));
      const stats = await stat(abs).catch((): undefined => undefined);
      if (stats === undefined || !stats.isFile() || stats.size > Constants.indexing.maxFileBytes) {
        continue;
      }

      const buf = await readFile(abs);
      if (buf.includes(0)) {
        continue;
      }

      const text = buf.toString(`utf8`);
      const digest = hashUtf8(text);
      const previous = manifest[relativePath];
      if (previous?.sha256 === digest) {
        filesSkippedUnchanged += 1;
        continue;
      }

      const chunks = CoderChunk.build(relativePath, text).filter(chunk => chunk.text.trim().length > 0);
      if (chunks.length === 0) {
        filesSkipped.push(relativePath);
        continue;
      }

      changedJobs.push({ chunks, digest, path: relativePath, totalChunks: chunks.length });
    }

    const pending: WriteJob[] = [];
    const filesWrittenRef: Record<string, number> = {};
    const filesDigestByPath = _.fromEntries(changedJobs.map(job => [job.path, job.digest]));
    const waitingConsumer: Action[] = [];
    const waitingProducers: Action[] = [];
    let chunkTotal = 0;
    let filesDone = 0;
    let producerDone = false;
    let failed: unknown;
    let writesSinceManifestSave = 0;
    if (changedJobs.length > 0) {
      for (const { path: changedPath } of changedJobs) {
        filesWrittenRef[changedPath] = 0;
      }
      lanceNeedsReindex = true;
    }

    const onFileCompleted = async (currentPath: string) => {
      const digest = filesDigestByPath[currentPath];
      if (digest === undefined) {
        throw new Error(`coder_index_missing_digest`);
      }
      manifest[currentPath] = { sha256: digest };
      filesDone += 1;
      writesSinceManifestSave += 1;
      onProgress?.({ filesDone, filesTotal, kind: `file`, path: currentPath });

      if (writesSinceManifestSave >= Constants.indexing.writesUntilManifestFlush) {
        writesSinceManifestSave = 0;
        const nextManifest: IndexManifestState = { embeddingModelName: embeddingModel.name, files: manifest };
        await saveManifest(dbDir, nextManifest);
      }
    };

    const wakeOne = (queue: Action[]) => {
      const wake = queue.shift();
      if (wake !== undefined) {
        wake();
      }
    };

    const wakeAll = (queue: Action[]) => {
      while (queue.length > 0) {
        wakeOne(queue);
      }
    };

    const wait = async (queue: Action[]) =>
      new Promise<void>(resolve => {
        queue.push(resolve);
      });

    const fail = (error: unknown) => {
      if (failed === undefined) {
        failed = error;
      }
      producerDone = true;
      wakeAll(waitingConsumer);
      wakeAll(waitingProducers);
    };

    const enqueue = async (job: WriteJob) => {
      while (pending.length >= Constants.indexing.maxPendingWrites) {
        if (failed !== undefined) {
          throw failed;
        }
        await wait(waitingProducers);
      }
      pending.push(job);
      wakeOne(waitingConsumer);
    };

    const dequeue = async (): Promise<undefined | WriteJob> => {
      while (pending.length === 0) {
        if (failed !== undefined) {
          throw failed;
        }
        if (producerDone) {
          return undefined;
        }
        await wait(waitingConsumer);
      }
      const job = pending.shift();
      wakeOne(waitingProducers);

      return job;
    };

    await store.replace(
      changedJobs.map(job => job.path),
      async write => {
        const flushWriteJobs = async (jobs: WriteJob[]) => {
          if (jobs.length === 0) {
            return;
          }
          await write(jobs.map(job => ({ path: job.path, rows: job.rows })));
          chunkTotal += _.sum(jobs.map(job => job.rows.length)) ?? 0;

          for (const job of jobs) {
            const written = (filesWrittenRef[job.path] ?? 0) + job.rows.length;
            filesWrittenRef[job.path] = written;
            if (written === job.totalChunks) {
              await onFileCompleted(job.path);
            }
          }
        };

        const consumer = async () => {
          while (true) {
            const next = await dequeue();
            if (next === undefined) {
              break;
            }
            await flushWriteJobs([next]);
          }
        };

        const producer = async () => {
          const queue = toQueue(changedJobs);
          let cursor = 0;

          const worker = async () => {
            while (cursor < queue.length) {
              const start = cursor;
              const batch = takeBatch(queue, start, Constants.embedding.batchChunkCount);
              cursor = start + batch.length;
              if (batch.length === 0) {
                continue;
              }

              const { vectors } = await embeddingModel.process(batch.map(item => item.chunk.text));
              if (vectors.length !== batch.length) {
                throw new Error(`coder_index_embed_length`);
              }

              const dim = vectors[0]?.length;
              if (dim === undefined || vectors.some(vector => vector.length !== dim)) {
                throw new Error(`coder_index_embed_dim`);
              }

              const grouped: Record<string, EmbeddedBatch & { digest: string }> = {};
              for (const [index, item] of batch.entries()) {
                const vector = vectors[index];
                if (item === undefined || vector === undefined) {
                  throw new Error(`coder_index_embed_row`);
                }

                const row = { ...item.chunk, digest: item.digest, vector } satisfies VectorStoreChunk;
                const current = grouped[item.path];
                if (current === undefined) {
                  grouped[item.path] = {
                    digest: item.digest,
                    path: item.path,
                    rows: [row],
                    totalChunks: item.totalChunks,
                  };
                  continue;
                }
                current.rows.push(row);
              }

              for (const data of Object.values(grouped)) {
                await enqueue(data);
              }
            }
          };

          try {
            const workers = _.gen(Math.max(1, Constants.embedding.maxParallelRequests), worker);
            await Promise.all(workers);
          } catch (error) {
            fail(error);
            throw error;
          } finally {
            producerDone = true;
            wakeAll(waitingConsumer);
          }
        };

        await Promise.all([producer(), consumer()]);
      },
    );

    if (failed !== undefined) {
      throw failed;
    }

    if (lanceNeedsReindex) {
      await store.reindex();
    }

    const nextManifest: IndexManifestState = { embeddingModelName: embeddingModel.name, files: manifest };
    await saveManifest(dbDir, nextManifest);
    onProgress?.({
      chunkCount: chunkTotal,
      filesIndexed: changedJobs.length,
      filesSkippedUnchanged,
      filesTotal,
      kind: `done`,
    });

    return { chunkTotal, filesIndexed: changedJobs.length, filesSkipped, filesSkippedUnchanged } satisfies SyncResult;
  };

export type Indexer = ReturnType<typeof Indexer>;
