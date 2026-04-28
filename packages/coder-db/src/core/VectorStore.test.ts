// cspell:word nprobes
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable @typescript-eslint/require-await */
import { _ } from "@snappy/core";
import { describe, expect, it, vi } from "vitest";

import { Constants } from "../Constants";
import { VectorStore, type VectorStoreChunk } from "./VectorStore";

const mocks = vi.hoisted(() => {
  const state = {
    closed: false,
    countRows: 0,
    createIndexCalls: [] as string[],
    createIndexOptions: [] as unknown[],
    createTableSeedRows: [] as VectorStoreChunk[][],
    deleteWhereClauses: [] as string[],
    dropTableCalls: [] as string[],
    limitValues: [] as number[],
    nprobesValues: [] as number[],
    optimizeCalls: 0,
    searchRows: [] as (Omit<VectorStoreChunk, `vector`> & { _distance?: number })[],
    searchVectors: [] as number[][],
    selectFields: [] as string[][],
    tableAddCalls: [] as VectorStoreChunk[][],
    tableIndices: [] as { columns?: string[]; name?: string }[],
    tableNames: [] as string[],
  };

  const table = {
    add: vi.fn(async (rows: VectorStoreChunk[]) => {
      state.tableAddCalls.push(rows);
    }),
    countRows: vi.fn(async () => state.countRows),
    createIndex: vi.fn(async (field: string, options?: unknown) => {
      state.createIndexCalls.push(field);
      state.createIndexOptions.push(options);
    }),
    delete: vi.fn(async (whereClause: string) => {
      state.deleteWhereClauses.push(whereClause);
    }),
    listIndices: vi.fn(async () => state.tableIndices),
    optimize: vi.fn(async () => {
      state.optimizeCalls += 1;
    }),
    vectorSearch: vi.fn((vector: number[]) => {
      state.searchVectors.push(vector);
      const chain = {
        limit: (value: number) => {
          state.limitValues.push(value);

          return chain;
        },
        nprobes: (value: number) => {
          state.nprobesValues.push(value);

          return chain;
        },
        select: (fields: string[]) => {
          state.selectFields.push(fields);

          return chain;
        },
        toArray: async () => state.searchRows,
      };

      return chain;
    }),
  };

  const connection = {
    close: vi.fn(() => {
      state.closed = true;
    }),
    createTable: vi.fn(async (_name: string, seedRows: VectorStoreChunk[]) => {
      state.createTableSeedRows.push(seedRows);

      return table;
    }),
    dropTable: vi.fn(async (name: string) => {
      state.dropTableCalls.push(name);
    }),
    openTable: vi.fn(async () => table),
    tableNames: vi.fn(async () => state.tableNames),
  };

  const reset = () => {
    state.closed = false;
    state.countRows = 0;
    state.createIndexCalls = [];
    state.createIndexOptions = [];
    state.createTableSeedRows = [];
    state.deleteWhereClauses = [];
    state.dropTableCalls = [];
    state.limitValues = [];
    state.nprobesValues = [];
    state.optimizeCalls = 0;
    state.searchRows = [];
    state.searchVectors = [];
    state.selectFields = [];
    state.tableAddCalls = [];
    state.tableIndices = [];
    state.tableNames = [];
    vi.clearAllMocks();
  };

  return { connection, reset, state };
});

vi.mock(`@lancedb/lancedb`, () => ({
  connect: vi.fn(async () => mocks.connection),
  Index: { ivfPq: (options: unknown) => ({ kind: `ivfPq`, options }) },
}));

const makeChunk = (index: number, path = `a.ts`): VectorStoreChunk => ({
  chunkIndex: index,
  digest: `d-${String(index)}`,
  endLine: index + 1,
  path,
  startLine: index,
  text: `chunk-${String(index)}`,
  vector: [index, index + 1],
});

describe(`add`, () => {
  it(`creates table from first row and appends the rest when table absent`, async () => {
    mocks.reset();
    const store = await VectorStore(`mem://db`);
    const rows = [makeChunk(0), makeChunk(1), makeChunk(2)];

    await store.add(rows);

    expect(mocks.connection.createTable).toHaveBeenCalledTimes(1);
    expect(mocks.state.createTableSeedRows).toStrictEqual([[rows[0]]]);
    expect(mocks.state.tableAddCalls).toStrictEqual([[rows[1], rows[2]]]);
  });

  it(`writes existing table in batches by rowsPerWriteBatch`, async () => {
    mocks.reset();
    const batchSize = Constants.lanceDb.rowsPerWriteBatch;
    mocks.state.tableNames = [`code_chunks`];
    const store = await VectorStore(`mem://db`);
    const rows = _.gen(batchSize * 2 + 1, index => makeChunk(index));

    await store.add(rows);

    expect(mocks.connection.openTable).toHaveBeenCalledTimes(1);
    expect(mocks.state.tableAddCalls).toHaveLength(3);
    expect(mocks.state.tableAddCalls[0]).toHaveLength(batchSize);
    expect(mocks.state.tableAddCalls[1]).toHaveLength(batchSize);
    expect(mocks.state.tableAddCalls[2]).toHaveLength(1);
  });
});

describe(`remove`, () => {
  it(`skips delete when table is missing`, async () => {
    mocks.reset();
    const store = await VectorStore(`mem://db`);

    await store.remove(`a.ts`);

    expect(mocks.state.deleteWhereClauses).toStrictEqual([]);
  });

  it(`escapes quote in path for delete expression`, async () => {
    mocks.reset();
    mocks.state.tableNames = [`code_chunks`];
    const store = await VectorStore(`mem://db`);

    await store.remove(`a'b.ts`);

    expect(mocks.state.deleteWhereClauses).toStrictEqual([`path = 'a''b.ts'`]);
  });
});

describe(`clean`, () => {
  it(`drops table when present`, async () => {
    mocks.reset();
    mocks.state.tableNames = [`code_chunks`];
    const store = await VectorStore(`mem://db`);

    await store.clean();

    expect(mocks.state.dropTableCalls).toStrictEqual([`code_chunks`]);
  });

  it(`is no-op when table missing`, async () => {
    mocks.reset();
    const store = await VectorStore(`mem://db`);

    await store.clean();

    expect(mocks.state.dropTableCalls).toStrictEqual([]);
  });
});

describe(`search`, () => {
  it(`returns empty result when table missing`, async () => {
    mocks.reset();
    const store = await VectorStore(`mem://db`);

    await expect(store.search([1, 2], { limit: 3 })).resolves.toStrictEqual([]);
  });

  it(`maps _distance to distance and applies query options`, async () => {
    mocks.reset();
    mocks.state.tableNames = [`code_chunks`];
    mocks.state.searchRows = [
      { _distance: 0.42, chunkIndex: 0, digest: `d0`, endLine: 2, path: `a.ts`, startLine: 1, text: `x` },
    ];
    const store = await VectorStore(`mem://db`);
    const result = await store.search([9, 9], { limit: 5 });

    expect(result).toStrictEqual([
      { chunkIndex: 0, digest: `d0`, distance: 0.42, endLine: 2, path: `a.ts`, startLine: 1, text: `x` },
    ]);
    expect(mocks.state.searchVectors).toStrictEqual([[9, 9]]);
    expect(mocks.state.nprobesValues).toStrictEqual([Constants.lanceDb.queryNprobes]);
    expect(mocks.state.limitValues).toStrictEqual([5]);
    expect(mocks.state.selectFields[0]).toContain(`_distance`);
    expect(mocks.state.selectFields[0]).toContain(`path`);
  });

  it(`uses custom nprobes when provided`, async () => {
    mocks.reset();
    mocks.state.tableNames = [`code_chunks`];
    const store = await VectorStore(`mem://db`);

    await store.search([2, 3], { limit: 4, nprobes: 33 });

    expect(mocks.state.nprobesValues).toStrictEqual([33]);
    expect(mocks.state.limitValues).toStrictEqual([4]);
  });
});

describe(`reindex`, () => {
  it(`skips when table missing`, async () => {
    mocks.reset();
    const store = await VectorStore(`mem://db`);

    await store.reindex();

    expect(mocks.state.createIndexCalls).toStrictEqual([]);
  });

  it(`skips when row count below threshold`, async () => {
    mocks.reset();
    mocks.state.tableNames = [`code_chunks`];
    mocks.state.countRows = Constants.lanceDb.minRowsForVectorIndex - 1;
    const store = await VectorStore(`mem://db`);

    await store.reindex();

    expect(mocks.state.createIndexCalls).toStrictEqual([]);
  });

  it(`creates vector index when row count is sufficient`, async () => {
    mocks.reset();
    mocks.state.tableNames = [`code_chunks`];
    mocks.state.countRows = Constants.lanceDb.minRowsForVectorIndex;
    const store = await VectorStore(`mem://db`);

    await store.reindex();

    expect(mocks.state.createIndexCalls).toStrictEqual([`vector`]);
    expect(mocks.state.createIndexOptions).toHaveLength(1);
    expect(mocks.state.optimizeCalls).toBe(0);
  });

  it(`creates vector index with bounded partition count`, async () => {
    mocks.reset();
    mocks.state.tableNames = [`code_chunks`];
    mocks.state.countRows = Constants.lanceDb.minRowsForVectorIndex * 10;
    const store = await VectorStore(`mem://db`);

    await store.reindex();

    expect(mocks.state.createIndexCalls).toStrictEqual([`vector`]);

    const options = mocks.state.createIndexOptions[0] as {
      config?: { kind: string; options?: { numPartitions?: number } };
    };

    expect(options.config?.kind).toBe(`ivfPq`);
    expect(options.config?.options?.numPartitions).toBe(
      Math.floor((Constants.lanceDb.minRowsForVectorIndex * 10) / Constants.lanceDb.indexRowsPerPartition),
    );
  });

  it(`runs optimize when vector index already exists`, async () => {
    mocks.reset();
    mocks.state.tableNames = [`code_chunks`];
    mocks.state.countRows = Constants.lanceDb.minRowsForVectorIndex;
    mocks.state.tableIndices = [{ name: `vector_idx` }];
    const store = await VectorStore(`mem://db`);

    await store.reindex();

    expect(mocks.state.createIndexCalls).toStrictEqual([]);
    expect(mocks.state.optimizeCalls).toBe(1);
  });
});

describe(`replace`, () => {
  it(`removes unique paths and flushes coalesced writes`, async () => {
    mocks.reset();
    const flushThreshold = Constants.lanceDb.rowsPerWriteBatch * Constants.lanceDb.coalescedWriteMultiplier;
    mocks.state.tableNames = [`code_chunks`];
    const store = await VectorStore(`mem://db`);
    const rowsA = _.gen(flushThreshold, index => makeChunk(index, `a.ts`));
    const rowC = makeChunk(flushThreshold, `c.ts`);
    const rowB = makeChunk(flushThreshold + 1, `b.ts`);

    await store.replace([`a.ts`, `a.ts`, `b.ts`], async write => {
      await write([{ path: `a.ts`, rows: rowsA }]);
      await write([{ path: `c.ts`, rows: [rowC] }]);
      await write([{ path: `b.ts`, rows: [rowB] }]);
    });

    expect(mocks.state.deleteWhereClauses).toStrictEqual([`path = 'a.ts'`, `path = 'b.ts'`, `path = 'c.ts'`]);
    expect(mocks.state.tableAddCalls.length).toBeGreaterThan(1);

    const writtenRows = mocks.state.tableAddCalls.flat().length;

    expect(writtenRows).toBe(rowsA.length + 2);
  });

  it(`propagates callback error`, async () => {
    mocks.reset();
    mocks.state.tableNames = [`code_chunks`];
    const store = await VectorStore(`mem://db`);

    await expect(
      store.replace([`a.ts`], async write => {
        await write([{ path: `a.ts`, rows: [makeChunk(0, `a.ts`)] }]);
        throw new Error(`boom`);
      }),
    ).rejects.toThrow(`boom`);
  });
});

describe(`close`, () => {
  it(`closes connection`, async () => {
    mocks.reset();
    const store = await VectorStore(`mem://db`);

    store.close();

    expect(mocks.state.closed).toBe(true);
  });
});
