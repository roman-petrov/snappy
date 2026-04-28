import { describe, expect, it } from "vitest";

import type { VectorSearchRow } from "./VectorStore";

import { type RerankConfig, Reranker } from "./Reranker";

const hit = (path: string, overrides: Partial<VectorSearchRow> = {}): VectorSearchRow => ({
  chunkIndex: 0,
  digest: `digest-${path}`,
  distance: 0,
  endLine: 1,
  path,
  startLine: 1,
  text: `code`,
  ...overrides,
});

const config = {
  contradictionWeight: 0.12,
  distancePenalty: 0.18,
  evidenceK: 8,
  evidenceSimilarityFloor: 0.55,
  evidenceWeight: 0.5,
  maxPerDir: 4,
  maxPerFile: 2,
  mmrLambda: 0.8,
  mmrRedundancyWeight: 0.6,
  querySimilarityWeight: 1,
} satisfies RerankConfig;

const queryAxis = [1, 0, 0];
const embedAxis = [1, 0, 0];

describe(`Reranker`, () => {
  it(`returns slice when at most one candidate`, () => {
    expect(Reranker.rerank({ candidates: [], config, queryVector: queryAxis, topK: 5, vectors: [] })).toStrictEqual([]);

    const one = [hit(`a.ts`)];

    expect(
      Reranker.rerank({ candidates: one, config, queryVector: queryAxis, topK: 5, vectors: [embedAxis] }),
    ).toStrictEqual(one);
  });

  it(`respects topK when bypassing full rerank`, () => {
    expect(
      Reranker.rerank({ candidates: [hit(`a.ts`)], config, queryVector: queryAxis, topK: 0, vectors: [embedAxis] }),
    ).toStrictEqual([]);
  });

  it(`limits hits per file via maxPerFile`, () => {
    const path = `pkg/file.ts`;

    const candidates = [
      hit(path, { chunkIndex: 0, digest: `a` }),
      hit(path, { chunkIndex: 1, digest: `b` }),
      hit(path, { chunkIndex: 2, digest: `c` }),
    ];

    const vectors = [embedAxis, embedAxis, embedAxis];

    expect(Reranker.rerank({ candidates, config, queryVector: queryAxis, topK: 10, vectors })).toStrictEqual([
      candidates[0],
      candidates[1],
    ]);
  });

  it(`orders equal-score hits by ascending path`, () => {
    const candidates = [hit(`z.ts`), hit(`m.ts`), hit(`a.ts`)];
    const vectors = [embedAxis, embedAxis, embedAxis];

    expect(Reranker.rerank({ candidates, config, queryVector: queryAxis, topK: 3, vectors })).toStrictEqual([
      hit(`a.ts`),
      hit(`m.ts`),
      hit(`z.ts`),
    ]);
  });

  it(`caps output by topK with deterministic ordering`, () => {
    const candidates = [hit(`c.ts`), hit(`a.ts`), hit(`b.ts`)];
    const vectors = [embedAxis, embedAxis, embedAxis];

    expect(Reranker.rerank({ candidates, config, queryVector: queryAxis, topK: 2, vectors })).toStrictEqual([
      hit(`a.ts`),
      hit(`b.ts`),
    ]);
  });

  it(`breaks ties by path when topK is 1`, () => {
    const candidates = [hit(`z.ts`), hit(`a.ts`)];
    const vectors = [embedAxis, embedAxis];

    expect(Reranker.rerank({ candidates, config, queryVector: queryAxis, topK: 1, vectors })).toStrictEqual([
      hit(`a.ts`),
    ]);
  });

  it(`prefers lower ANN distance when vectors match`, () => {
    const closer = hit(`b.ts`, { distance: 0.05 });
    const farther = hit(`a.ts`, { distance: 0.5 });
    const candidates = [farther, closer];
    const vectors = [embedAxis, embedAxis];

    expect(Reranker.rerank({ candidates, config, queryVector: queryAxis, topK: 1, vectors })).toStrictEqual([closer]);
  });

  it(`keeps higher query similarity first`, () => {
    const aligned = hit(`match.ts`, { chunkIndex: 0, digest: `m1` });
    const orthogonal = hit(`miss.ts`, { chunkIndex: 0, digest: `m2` });
    const candidates = [orthogonal, aligned];

    const vectors = [
      [0, 1, 0],
      [1, 0, 0],
    ];

    expect(Reranker.rerank({ candidates, config, queryVector: queryAxis, topK: 2, vectors })).toStrictEqual([
      aligned,
      orthogonal,
    ]);
  });

  it(`avoids near-duplicate dominance with MMR`, () => {
    const configWithStrongerDiversity = {
      ...config,
      contradictionWeight: 0,
      evidenceWeight: 0,
      mmrLambda: 0.2,
      mmrRedundancyWeight: 1.2,
    } satisfies RerankConfig;

    const candidates = [hit(`src/a.ts`), hit(`src/b.ts`), hit(`docs/c.ts`)];

    const vectors = [
      [0.99, 0.1, 0],
      [0.99, 0.11, 0],
      [0.84, 0.54, 0],
    ];

    expect(
      Reranker.rerank({ candidates, config: configWithStrongerDiversity, queryVector: queryAxis, topK: 2, vectors }),
    ).toStrictEqual([candidates[0], candidates[2]]);
  });

  it(`prefers a small but highly relevant group over generic duplicates`, () => {
    const candidates = [
      hit(`generic/one.ts`),
      hit(`generic/two.ts`),
      hit(`generic/three.ts`),
      hit(`target/match.ts`),
      hit(`target/match-2.ts`),
    ];

    const vectors = [
      [0.7, 0.71, 0],
      [0.7, 0.71, 0],
      [0.7, 0.71, 0],
      [0.97, 0.24, 0],
      [0.96, 0.26, 0],
    ];

    expect(Reranker.rerank({ candidates, config, queryVector: queryAxis, topK: 2, vectors })).toStrictEqual([
      candidates[3],
      candidates[4],
    ]);
  });

  it(`applies maxPerDir by keeping lexicographically first paths in directory`, () => {
    const candidates = [hit(`src/e.ts`), hit(`src/a.ts`), hit(`src/d.ts`), hit(`src/b.ts`), hit(`src/c.ts`)];
    const vectors = candidates.map(() => embedAxis);

    expect(Reranker.rerank({ candidates, config, queryVector: queryAxis, topK: 10, vectors })).toStrictEqual([
      hit(`src/a.ts`),
      hit(`src/b.ts`),
      hit(`src/c.ts`),
      hit(`src/d.ts`),
    ]);
  });

  it(`returns empty list when topK is 0 with multiple candidates`, () => {
    const candidates = [hit(`c.ts`), hit(`a.ts`), hit(`b.ts`)];
    const vectors = [embedAxis, embedAxis, embedAxis];

    expect(Reranker.rerank({ candidates, config, queryVector: queryAxis, topK: 0, vectors })).toStrictEqual([]);
  });

  it(`does not mutate input candidates or vectors`, () => {
    const candidates = [hit(`x.ts`), hit(`y.ts`)];

    const vectors = [
      [1, 0, 0],
      [0, 1, 0],
    ];

    const candidatesBefore = structuredClone(candidates);
    const vectorsBefore = structuredClone(vectors);

    Reranker.rerank({ candidates, config, queryVector: queryAxis, topK: 2, vectors });

    expect(candidates).toStrictEqual(candidatesBefore);
    expect(vectors).toStrictEqual(vectorsBefore);
  });

  it(`deduplicates candidates by digest inside reranker`, () => {
    const candidates = [
      hit(`docs/legacy.md`, { digest: `same`, distance: 0.6 }),
      hit(`src/current.ts`, { digest: `same`, distance: 0.1 }),
      hit(`src/other.ts`, { digest: `other`, distance: 0.2 }),
    ];

    const vectors = [
      [0.3, 0.95, 0],
      [0.98, 0.2, 0],
      [0.8, 0.6, 0],
    ];

    expect(Reranker.rerank({ candidates, config, queryVector: queryAxis, topK: 3, vectors })).toStrictEqual([
      candidates[1],
      candidates[2],
    ]);
  });

  it(`prefers candidates with independent support over isolated claim`, () => {
    const configWithEvidencePriority = {
      ...config,
      evidenceK: 3,
      evidenceWeight: 1.8,
      mmrLambda: 0.45,
    } satisfies RerankConfig;

    const candidates = [
      hit(`docs/monetization.md`, { digest: `d0`, distance: 0.01 }),
      hit(`packages/coder-cli/src/feature.ts`, { digest: `d1`, distance: 0.04 }),
      hit(`packages/coder/src/core/feature.ts`, { digest: `d2`, distance: 0.04 }),
      hit(`packages/server-app/src/feature.ts`, { digest: `d3`, distance: 0.05 }),
    ];

    const vectors = [
      [0.99, 0.11, 0],
      [0.92, 0.38, 0],
      [0.91, 0.39, 0],
      [0.9, 0.4, 0],
    ];

    expect(
      Reranker.rerank({ candidates, config: configWithEvidencePriority, queryVector: queryAxis, topK: 2, vectors }),
    ).toStrictEqual([candidates[1], candidates[2]]);
  });
});
