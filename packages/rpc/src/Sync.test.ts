/* @vitest-environment node */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable @typescript-eslint/require-await */
import { Store } from "@snappy/core";
import { describe, expect, it, vi } from "vitest";

import { Sync } from "./Sync";

const { doc, list, scope } = Sync;

type Leaf<TIn, TOut> = ((input: TIn) => Promise<TOut>) & {
  emit: (data: TOut) => void;
  on: (listener: (data: TOut) => void) => () => void;
};

const leaf = <TIn, TOut>(handle: (input: TIn) => Promise<TOut>): Leaf<TIn, TOut> => {
  const listeners = new Set<(data: TOut) => void>();

  return Object.assign(handle, {
    emit: (data: TOut) => {
      for (const listener of listeners) {
        listener(data);
      }
    },
    on: (listener: (data: TOut) => void) => {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },
  });
};

const voidLeaf = <TOut>(handle: () => Promise<TOut>) => {
  const listeners = new Set<(data: TOut) => void>();

  return Object.assign(handle, {
    emit: (data: TOut) => {
      for (const listener of listeners) {
        listener(data);
      }
    },
    on: (listener: (data: TOut) => void) => {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },
  });
};

describe(`track`, () => {
  it(`applies call result and live events while open`, async () => {
    const api = { close: vi.fn(), open: vi.fn() };
    const sync = scope({ api });
    const values: number[] = [];
    const proc = leaf(async (n: number) => n * 2);

    const run = sync.track(proc, value => {
      values.push(value);
    });

    await sync.open();

    await expect(run(3)).resolves.toBe(6);

    proc.emit(10);

    expect(values).toStrictEqual([6, 10]);
    expect(api.open).toHaveBeenCalledTimes(1);
  });

  it(`does not apply live events after close`, async () => {
    const api = { close: vi.fn(), open: vi.fn() };
    const sync = scope({ api });
    const values: number[] = [];
    const proc = leaf(async (n: number) => n);
    sync.track(proc, value => {
      values.push(value);
    });

    await sync.open();
    proc.emit(1);
    sync.close();
    proc.emit(2);

    expect(values).toStrictEqual([1]);
    expect(api.close).toHaveBeenCalledTimes(1);
  });
});

describe(`open`, () => {
  it(`reseeds on every call`, async () => {
    const api = { close: vi.fn(), open: vi.fn() };
    const sync = scope({ api });
    let value = 1;
    const read = voidLeaf(async () => value);
    const amount = sync.mirror(read);

    await sync.open();

    expect(amount()).toBe(1);

    expect(api.open).toHaveBeenCalledTimes(1);
    expect(api.close).not.toHaveBeenCalled();

    value = 2;
    await sync.open();

    expect(amount()).toBe(2);

    expect(api.open).toHaveBeenCalledTimes(2);
    expect(api.close).toHaveBeenCalledTimes(1);
  });

  it(`does not close the transport on the first open`, async () => {
    const api = { close: vi.fn(), open: vi.fn() };
    const sync = scope({ api });
    const read = voidLeaf(async () => 1);
    sync.mirror(read);

    await sync.open();

    expect(api.open).toHaveBeenCalledTimes(1);
    expect(api.close).not.toHaveBeenCalled();
  });

  it(`does not apply a late load after close`, async () => {
    const api = { close: vi.fn(), open: vi.fn() };
    const sync = scope({ api });
    const { promise, resolve } = Promise.withResolvers<number>();
    const read = voidLeaf(async () => promise);
    const amount = sync.mirror(read);

    await sync.open();
    const loading = amount.load();
    sync.close();
    resolve(9);
    await loading;

    expect(amount()).toBeUndefined();
  });

  it(`does not reopen after close while open is queued`, async () => {
    const api = { close: vi.fn(), open: vi.fn() };
    const sync = scope({ api });
    const read = voidLeaf(async () => 1);
    sync.mirror(read);

    const opening = sync.open();
    sync.close();
    await opening;

    expect(api.open).not.toHaveBeenCalled();
    expect(api.close).toHaveBeenCalledTimes(1);
  });

  it(`resolves before a slow seed finishes`, async () => {
    const api = { close: vi.fn(), open: vi.fn() };
    const sync = scope({ api });
    const blockers: (() => void)[] = [];

    const read = voidLeaf(async () => {
      await new Promise<void>(resolve => {
        blockers.push(resolve);
      });

      return 7;
    });

    const amount = sync.mirror(read);
    await sync.open();

    expect(amount()).toBeUndefined();
    expect(blockers).toHaveLength(1);

    blockers[0]?.();

    await vi.waitFor(() => {
      expect(amount()).toBe(7);
    });
  });

  it(`keeps the session open when seed fails`, async () => {
    const api = { close: vi.fn(), open: vi.fn() };
    const sync = scope({ api });
    const errors: unknown[] = [];

    const onUnhandled = (reason: unknown) => {
      errors.push(reason);
    };

    process.on(`unhandledRejection`, onUnhandled);

    const read = voidLeaf(async () => {
      throw new Error(`disconnected`);
    });

    const amount = sync.mirror(read);

    await sync.open();
    await Promise.resolve();
    await Promise.resolve();

    process.off(`unhandledRejection`, onUnhandled);

    expect(amount()).toBeUndefined();
    expect(errors).toHaveLength(0);
    expect(api.open).toHaveBeenCalledTimes(1);
  });

  it(`serializes concurrent opens so a later open still seeds`, async () => {
    const api = { close: vi.fn(), open: vi.fn() };
    const sync = scope({ api });
    let seed = 0;
    const blockers: (() => void)[] = [];

    const read = voidLeaf(async () => {
      seed += 1;
      const n = seed;
      if (n === 1) {
        await new Promise<void>(resolve => {
          blockers.push(resolve);
        });
        throw new Error(`disconnected`);
      }

      return n;
    });

    const amount = sync.mirror(read);
    const first = sync.open();

    await vi.waitFor(() => {
      expect(blockers).toHaveLength(1);
    });

    await first;
    const second = sync.open();

    await vi.waitFor(() => {
      expect(amount()).toBe(2);
    });

    await second;
    blockers[0]?.();
    await Promise.resolve();

    expect(amount()).toBe(2);
  });
});

describe(`mirror`, () => {
  it(`replaces store from load, write, and events`, async () => {
    const api = { close: vi.fn(), open: vi.fn() };
    const sync = scope({ api });
    const read = voidLeaf(async () => 1);
    const write = leaf(async (n: number) => n + 1);
    const amount = sync.mirror(read, { write });

    await sync.open();
    await amount.load();

    expect(amount()).toBe(1);

    await amount.write(4);

    expect(amount()).toBe(5);

    read.emit(9);

    expect(amount()).toBe(9);

    sync.close();

    expect(amount()).toBeUndefined();
  });

  it(`loads from open`, async () => {
    const api = { close: vi.fn(), open: vi.fn() };
    const sync = scope({ api });
    const read = voidLeaf(async () => 7);
    const amount = sync.mirror(read);

    await sync.open();

    expect(amount()).toBe(7);
  });
});

describe(`bind`, () => {
  it(`opens via adopt and closes when session becomes false`, async () => {
    const api = { close: vi.fn(), open: vi.fn() };
    const sync = scope({ api });
    const session = Store(false);
    const onOpen = vi.fn();
    const read = voidLeaf(async () => 1);
    const amount = sync.mirror(read);
    const adopt = sync.bind({ onOpen, session });

    session.set(true);
    await adopt();

    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(api.open).toHaveBeenCalledTimes(1);
    expect(amount()).toBe(1);

    session.set(false);

    expect(api.close).toHaveBeenCalledTimes(1);
    expect(amount()).toBeUndefined();
  });

  it(`reseeds on every adopt`, async () => {
    const api = { close: vi.fn(), open: vi.fn() };
    const sync = scope({ api });
    const session = Store(true);
    let value = 1;
    const read = voidLeaf(async () => value);
    const amount = sync.mirror(read);
    const adopt = sync.bind({ session });

    await adopt();

    expect(amount()).toBe(1);

    value = 2;
    await adopt();

    expect(amount()).toBe(2);
    expect(api.open).toHaveBeenCalledTimes(2);
  });
});

describe(`docs`, () => {
  it(`wires read/write seeds`, async () => {
    const api = { close: vi.fn(), open: vi.fn() };
    const sync = scope({ api });
    const read = voidLeaf(async () => 2);
    const write = leaf(async (n: number) => n + 1);
    const { amount } = sync.docs({ amount: { read, write } });

    await sync.open();

    expect(amount()).toBe(2);

    await amount.write(4);

    expect(amount()).toBe(5);
  });
});

describe(`lists`, () => {
  it(`loads, updates, merges, removes, and appends by id`, async () => {
    const api = { close: vi.fn(), open: vi.fn() };
    const sync = scope({ api });

    const listProc = leaf(async (input: { cursor?: string; limit: number }) =>
      input.cursor === undefined
        ? {
            items: [
              { id: `1`, text: `a` },
              { id: `2`, text: `b` },
            ],
            nextCursor: `c2`,
          }
        : { items: [{ id: `3`, text: `c` }] },
    );

    const create = leaf(async (item: { id: string; text?: string }) => ({ id: item.id, text: item.text ?? `` }));
    const update = leaf(async (row: { id: string; text: string }) => row);
    const remove = leaf(async (row: { id: string }) => row);
    const { rows } = sync.lists({ rows: { create, limit: 2, list: listProc, remove, update } });

    await sync.open();
    await rows.load();

    expect(rows()?.items.map(item => item.id)).toStrictEqual([`1`, `2`]);
    expect(rows()?.hasMore).toBe(true);

    await rows.create({ id: `0`, text: `z` });

    expect(rows()?.items.map(item => item.id)).toStrictEqual([`0`, `1`, `2`]);

    await rows.update({ id: `1`, text: `A` });

    expect(rows()?.items.find(item => item.id === `1`)).toStrictEqual({ id: `1`, text: `A` });

    await rows.append();

    expect(rows()?.items.map(item => item.id)).toStrictEqual([`0`, `1`, `2`, `3`]);
    expect(rows()?.hasMore).toBe(false);

    await rows.remove({ id: `2` });

    expect(rows()?.items.map(item => item.id)).toStrictEqual([`0`, `1`, `3`]);

    create.emit({ id: `0` } as { id: string; text: string });

    expect(rows()?.items.map(item => item.id)).toStrictEqual([`1`, `3`]);

    create.emit({ id: `9`, text: `live` });

    expect(rows()?.items.map(item => item.id)).toStrictEqual([`9`, `1`, `3`]);
  });

  it(`does not seed list until the first load`, async () => {
    const api = { close: vi.fn(), open: vi.fn() };
    const sync = scope({ api });
    const calls: unknown[] = [];

    const listProc = leaf(async (input?: { page?: number }) => {
      calls.push(input);

      return { items: [{ id: `1` }] };
    });

    const { rows } = sync.lists({ rows: { list: listProc } });

    await sync.open();

    expect(rows()).toBeUndefined();
    expect(calls).toHaveLength(0);

    await rows.load({ page: 2 });

    expect(rows()?.items.map(item => item.id)).toStrictEqual([`1`]);
    expect(calls).toStrictEqual([{ page: 2 }]);
  });

  it(`ignores a late list load for a superseded input`, async () => {
    const api = { close: vi.fn(), open: vi.fn() };
    const sync = scope({ api });
    const blockers: (() => void)[] = [];

    const listProc = leaf(async (input?: { page?: number }) => {
      const page = input?.page ?? 1;
      if (page === 1) {
        await new Promise<void>(resolve => {
          blockers.push(resolve);
        });
      }

      return { items: [{ id: String(page) }], page };
    });

    const { rows } = sync.lists({ rows: { list: listProc } });
    await sync.open();
    const first = rows.load({ page: 1 });
    await vi.waitFor(() => {
      expect(blockers).toHaveLength(1);
    });
    await rows.load({ page: 2 });

    expect(rows()?.items.map(item => item.id)).toStrictEqual([`2`]);

    blockers[0]?.();
    await first;

    expect(rows()?.items.map(item => item.id)).toStrictEqual([`2`]);
  });

  it(`reseeds the last list input after close and reopen`, async () => {
    const api = { close: vi.fn(), open: vi.fn() };
    const sync = scope({ api });
    const calls: unknown[] = [];

    const listProc = leaf(async (input?: { page?: number }) => {
      calls.push(input);

      return { items: [{ id: `1` }], page: input?.page };
    });

    const { rows } = sync.lists({ rows: { list: listProc } });

    await sync.open();
    await rows.load({ page: 2 });
    sync.close();
    await sync.open();

    expect(calls).toStrictEqual([{ page: 2 }, { page: 2 }]);
    expect(rows()?.page).toBe(2);
  });

  it(`ignores a late list response flushed from before reconnect`, async () => {
    const listeners = new Set<() => void>();

    const api = {
      close: vi.fn(),
      onReconnect: (listener: () => void) => {
        listeners.add(listener);

        return () => {
          listeners.delete(listener);
        };
      },
      open: vi.fn(),
    };

    const sync = scope({ api });
    const blockers: (() => void)[] = [];
    let calls = 0;

    const listProc = leaf(async () => {
      calls += 1;
      const n = calls;
      if (n === 1) {
        await new Promise<void>(resolve => {
          blockers.push(resolve);
        });
      }

      return { items: [{ id: String(n) }] };
    });

    const { rows } = sync.lists({ rows: { list: listProc } });
    await sync.open();
    const first = rows.load();
    await vi.waitFor(() => {
      expect(blockers).toHaveLength(1);
    });
    await Promise.all([...listeners].map(async listener => listener()));
    await vi.waitFor(() => {
      expect(rows()?.items.map(item => item.id)).toStrictEqual([`2`]);
    });
    blockers[0]?.();
    await first;

    expect(rows()?.items.map(item => item.id)).toStrictEqual([`2`]);
  });

  it(`applies only the latest concurrent list load`, async () => {
    const api = { close: vi.fn(), open: vi.fn() };
    const sync = scope({ api });
    const blockers: (() => void)[] = [];
    let calls = 0;

    const listProc = leaf(async () => {
      calls += 1;
      const n = calls;
      await new Promise<void>(resolve => {
        blockers.push(resolve);
      });

      return { items: [{ id: String(n) }] };
    });

    const { rows } = sync.lists({ rows: { list: listProc } });
    await sync.open();
    const first = rows.load();
    const second = rows.load();
    await vi.waitFor(() => {
      expect(blockers).toHaveLength(2);
    });
    blockers[0]?.();
    await first;

    expect(rows()?.items.map(item => item.id)).toBeUndefined();

    blockers[1]?.();
    await second;

    expect(rows()?.items.map(item => item.id)).toStrictEqual([`2`]);
  });

  it(`reseeds on reconnect with the last list input`, async () => {
    const listeners = new Set<() => void>();

    const api = {
      close: vi.fn(),
      onReconnect: (listener: () => void) => {
        listeners.add(listener);

        return () => {
          listeners.delete(listener);
        };
      },
      open: vi.fn(),
    };

    const sync = scope({ api });
    const calls: unknown[] = [];

    const listProc = leaf(async (input?: { page?: number }) => {
      calls.push(input);
      const page = input?.page ?? 1;

      return { items: [{ id: String(page) }], page };
    });

    const { rows } = sync.lists({ rows: { list: listProc } });

    await sync.open();
    await rows.load({ page: 2 });

    expect(rows()?.items.map(item => item.id)).toStrictEqual([`2`]);
    expect(calls).toStrictEqual([{ page: 2 }]);

    await Promise.all([...listeners].map(async listener => listener()));

    expect(calls).toStrictEqual([{ page: 2 }, { page: 2 }]);
    expect(rows()?.items.map(item => item.id)).toStrictEqual([`2`]);
  });

  it(`swallows reseed failures on reconnect`, async () => {
    const listeners = new Set<() => void>();

    const api = {
      close: vi.fn(),
      onReconnect: (listener: () => void) => {
        listeners.add(listener);

        return () => {
          listeners.delete(listener);
        };
      },
      open: vi.fn(),
    };

    const sync = scope({ api });
    let fail = false;

    const read = voidLeaf(async () => {
      if (fail) {
        throw new Error(`disconnected`);
      }

      return 1;
    });

    const amount = sync.mirror(read);
    const errors: unknown[] = [];

    const onUnhandled = (reason: unknown) => {
      errors.push(reason);
    };

    process.on(`unhandledRejection`, onUnhandled);
    await sync.open();
    fail = true;

    await Promise.all([...listeners].map(async listener => listener()));
    await Promise.resolve();
    process.off(`unhandledRejection`, onUnhandled);

    expect(errors).toHaveLength(0);
    expect(amount()).toBe(1);
  });

  it(`patches and reads into item store`, async () => {
    const api = { close: vi.fn(), open: vi.fn() };
    const sync = scope({ api });
    const listProc = leaf(async () => ({ items: [{ id: `1`, text: `a` }] }));
    const patch = leaf(async (row: { id: string; text: string }) => row);
    const read = leaf(async (input: { id: string }) => ({ id: input.id, text: `b` }));
    const { rows } = sync.lists({ rows: { list: listProc, patch, read } });

    await sync.open();
    await rows.load();
    await rows.patch({ id: `1`, text: `A` });

    expect(rows()?.items[0]).toStrictEqual({ id: `1`, text: `A` });

    await rows.read({ id: `1` });

    const itemOf = (rows as unknown as { $item: () => undefined | { id: string; text: string } }).$item;

    expect(itemOf()).toStrictEqual({ id: `1`, text: `b` });
  });
});

describe(`doc / list wiring`, () => {
  it(`maps a leaf and get/set namespace into doc entries`, () => {
    const value = voidLeaf(async () => ({ id: `1`, n: 1 }));
    const get = voidLeaf(async () => ({ theme: `dark` }));
    const set = leaf(async (input: { theme: string }) => input);

    expect(doc(value)).toStrictEqual({ read: value });
    expect(doc({ get, set })).toStrictEqual({ read: get, write: set });
  });

  it(`maps a list namespace and options`, () => {
    const listProc = leaf(async () => ({ items: [{ id: `1` }] }));
    const create = leaf(async (item: { id: string }) => item);
    const remove = leaf(async (row: { id: string }) => row);

    expect(list({ create, list: listProc, remove }, { limit: 20 })).toStrictEqual({
      create,
      limit: 20,
      list: listProc,
      remove,
    });
  });
});

describe(`resources`, () => {
  it(`merges docs and lists`, async () => {
    const api = { close: vi.fn(), open: vi.fn() };
    const sync = scope({ api });
    const read = voidLeaf(async () => 2);
    const listProc = leaf(async () => ({ items: [{ id: `1` }] }));
    const { amount, rows } = sync.resources({ docs: { amount: { read } }, lists: { rows: { list: listProc } } });

    await sync.open();

    expect(amount()).toBe(2);
    expect(rows()).toBeUndefined();

    await rows.load();

    expect(rows()?.items).toStrictEqual([{ id: `1` }]);
  });
});
