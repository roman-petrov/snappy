/* eslint-disable unicorn/no-array-reduce */
import { _, Vector } from "@snappy/core";

import type { VectorSearchRow } from "./VectorStore";

export type RerankConfig = {
  contradictionWeight: number;
  distancePenalty: number;
  evidenceK: number;
  evidenceSimilarityFloor: number;
  evidenceWeight: number;
  maxPerDir: number;
  maxPerFile: number;
  mmrLambda: number;
  mmrRedundancyWeight: number;
  querySimilarityWeight: number;
};

export type RerankInput = {
  candidates: VectorSearchRow[];
  config: RerankConfig;
  queryVector: number[];
  topK: number;
  vectors: number[][];
};

type DiversityAccumulator = {
  dirUsage: Map<string, number>;
  fileUsage: Map<string, number>;
  selectedIndices: number[];
};

type EvidenceSignal = { contradiction: number; support: number };

type RankedHit = { index: number; querySimilarity: number; row: VectorSearchRow; score: number };

const toDir = (path: string) => {
  const index = path.lastIndexOf(`/`);

  return index <= 0 ? path : path.slice(0, index);
};

const mapWith = <K, V>(base: ReadonlyMap<K, V>, key: K, value: V): Map<K, V> => new Map([...base, [key, value]]);

const normalize = (candidates: VectorSearchRow[], vectors: number[][]) => {
  const merged = candidates.reduce((accumulator, row, index) => {
    const vector = vectors[index] ?? [];
    const existing = accumulator.get(row.digest);

    if (existing === undefined || (row.distance ?? Infinity) < (existing.row.distance ?? Infinity)) {
      return mapWith(accumulator, row.digest, { row, vector });
    }

    return accumulator;
  }, new Map<string, { row: VectorSearchRow; vector: number[] }>());

  const ordered = [...merged.values()].toSorted(
    (left, right) =>
      (left.row.distance ?? Infinity) - (right.row.distance ?? Infinity) || left.row.path.localeCompare(right.row.path),
  );

  return { candidates: ordered.map(item => item.row), vectors: ordered.map(item => item.vector) };
};

const maxRedundancy = (index: number, selectedIndices: number[], vectors: number[][]) =>
  _.max(
    selectedIndices.map(selectedIndex => Vector.cosineSimilarity(vectors[index] ?? [], vectors[selectedIndex] ?? [])),
  ) ?? 0;

const evidenceSignals = (candidates: VectorSearchRow[], vectors: number[][], config: RerankConfig): EvidenceSignal[] =>
  _.gen(candidates.length, index => index).map(index => {
    const neighbors = _.gen(candidates.length, value => value)
      .filter(candidateIndex => candidateIndex !== index)
      .map(candidateIndex => ({
        index: candidateIndex,
        similarity: Vector.cosineSimilarity(vectors[index] ?? [], vectors[candidateIndex] ?? []),
      }))
      .toSorted((left, right) => right.similarity - left.similarity)
      .slice(0, config.evidenceK);

    if (neighbors.length === 0) {
      return { contradiction: 0, support: 0 };
    }

    const supportRaw =
      _.sum(neighbors.map(({ similarity }) => Math.max(0, similarity - config.evidenceSimilarityFloor))) ?? 0;

    const support = Math.log1p(supportRaw);

    const uniqueDirectories = new Set(
      neighbors.map(({ index: neighborIndex }) => toDir(candidates[neighborIndex]?.path ?? ``)),
    ).size;

    const independence = uniqueDirectories / neighbors.length;
    const contradiction = _.sum(neighbors.map(({ similarity }) => Math.max(0, -similarity))) ?? 0;

    return { contradiction, support: support * independence };
  });

const selectWithMmr = (
  candidates: VectorSearchRow[],
  queryVector: number[],
  vectors: number[][],
  config: RerankConfig,
  topK: number,
): VectorSearchRow[] => {
  const initial = {
    dirUsage: new Map<string, number>(),
    fileUsage: new Map<string, number>(),
    selectedIndices: [] as number[],
  } satisfies DiversityAccumulator;

  const evidence = evidenceSignals(candidates, vectors, config);

  const final = _.gen(candidates.length, value => value).reduce((accumulator: DiversityAccumulator) => {
    if (accumulator.selectedIndices.length >= topK) {
      return accumulator;
    }

    const ranked = _.gen(candidates.length, index => index)
      .filter(index => !accumulator.selectedIndices.includes(index))
      .flatMap(index => {
        const row = candidates[index];

        if (row === undefined) {
          return [];
        }

        const fileCount = accumulator.fileUsage.get(row.path) ?? 0;

        if (fileCount >= config.maxPerFile) {
          return [];
        }

        const dir = toDir(row.path);
        const dirCount = accumulator.dirUsage.get(dir) ?? 0;

        if (dirCount >= config.maxPerDir) {
          return [];
        }

        const querySimilarity = Vector.cosineSimilarity(vectors[index] ?? [], queryVector);
        const relevance = config.querySimilarityWeight * querySimilarity - config.distancePenalty * (row.distance ?? 0);

        const redundancy =
          accumulator.selectedIndices.length === 0 ? 0 : maxRedundancy(index, accumulator.selectedIndices, vectors);

        const score =
          config.mmrLambda * relevance +
          config.evidenceWeight * (evidence[index]?.support ?? 0) -
          (1 - config.mmrLambda) * config.mmrRedundancyWeight * redundancy -
          config.contradictionWeight * (evidence[index]?.contradiction ?? 0);

        return [{ index, querySimilarity, row, score } satisfies RankedHit];
      })
      .toSorted(
        (left, right) =>
          right.score - left.score ||
          right.querySimilarity - left.querySimilarity ||
          left.row.path.localeCompare(right.row.path),
      );

    const [best] = ranked;

    if (best === undefined) {
      return accumulator;
    }

    const dir = toDir(best.row.path);
    const fileCount = accumulator.fileUsage.get(best.row.path) ?? 0;
    const dirCount = accumulator.dirUsage.get(dir) ?? 0;

    return {
      dirUsage: mapWith(accumulator.dirUsage, dir, dirCount + 1),
      fileUsage: mapWith(accumulator.fileUsage, best.row.path, fileCount + 1),
      selectedIndices: [...accumulator.selectedIndices, best.index],
    };
  }, initial);

  return final.selectedIndices.map(index => candidates[index]).flatMap(row => (row === undefined ? [] : [row]));
};

const rerank = ({ candidates, config, queryVector, topK, vectors }: RerankInput): VectorSearchRow[] => {
  const normalized = normalize(candidates, vectors);

  if (normalized.candidates.length <= 1) {
    return normalized.candidates.slice(0, topK);
  }

  const safeVectors = normalized.vectors.map(vector => [...vector]);

  return selectWithMmr(normalized.candidates, queryVector, safeVectors, config, topK);
};

export const Reranker = { rerank };
