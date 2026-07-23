/* @vitest-environment jsdom */
/* eslint-disable @typescript-eslint/require-await */
import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Sync } from "./Sync";

const { scope } = Sync;

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

describe(`mirror`, () => {
  it(`subscribes to store updates in a hook`, async () => {
    const api = { close: vi.fn(), open: vi.fn() };
    const sync = scope({ api });
    const read = voidLeaf(async () => 1);
    const write = leaf(async (n: number) => n + 1);
    const amount = sync.mirror(read, { write });

    await sync.open();
    await amount.load();

    const { result } = renderHook(() => amount());

    expect(result.current).toStrictEqual([1, expect.any(Function)]);

    await act(async () => {
      await result.current[1](4);
    });

    expect(result.current[0]).toBe(5);

    act(() => {
      read.emit(9);
    });

    expect(result.current[0]).toBe(9);
  });
});

describe(`lists`, () => {
  it(`auto-loads and exposes item read/update`, async () => {
    const api = { close: vi.fn(), open: vi.fn() };
    const sync = scope({ api });
    const listProc = leaf(async () => ({ items: [{ id: `1`, text: `a` }] }));
    const read = leaf(async (input: { id: string }) => ({ id: input.id, text: `b` }));
    const update = leaf(async (row: { id: string; text: string }) => row);
    const { rows } = sync.lists({ rows: { list: listProc, read, update } });

    await sync.open();

    const { result } = renderHook(() => rows());

    await waitFor(() => {
      expect(result.current.items).toStrictEqual([{ id: `1`, text: `a` }]);
    });

    const { result: item } = renderHook(() => rows.item({ id: `1` }));

    await waitFor(() => {
      expect(item.current).toStrictEqual([{ id: `1`, text: `b` }, expect.any(Function)]);
    });

    await act(async () => {
      const [current, write] = Array.isArray(item.current) ? item.current : [undefined, undefined];
      void current;
      if (write !== undefined) {
        await write({ text: `c` });
      }
    });

    await waitFor(() => {
      expect(result.current.items.find(row => row.id === `1`)).toStrictEqual({ id: `1`, text: `c` });
    });
  });

  it(`reloads list and item after the store is cleared`, async () => {
    const api = { close: vi.fn(), open: vi.fn() };
    const sync = scope({ api });
    let listCalls = 0;
    let readCalls = 0;

    const listProc = leaf(async () => {
      listCalls += 1;

      return { items: [{ id: `1`, text: `a${listCalls}` }] };
    });

    const read = leaf(async (input: { id: string }) => {
      readCalls += 1;

      return { id: input.id, text: `b${readCalls}` };
    });

    const { rows } = sync.lists({ rows: { list: listProc, read } });

    await sync.open();
    const { result } = renderHook(() => rows());

    await waitFor(() => {
      expect(result.current.items).toStrictEqual([{ id: `1`, text: `a1` }]);
    });

    const { result: item } = renderHook(() => rows.item({ id: `1` }));

    await waitFor(() => {
      expect(item.current).toStrictEqual({ id: `1`, text: `b1` });
    });

    act(() => {
      sync.close();
    });

    await waitFor(() => {
      expect(result.current.items).toHaveLength(0);
      expect(item.current).toBeUndefined();
    });

    await act(async () => {
      await sync.open();
    });

    await waitFor(() => {
      expect(listCalls).toBeGreaterThan(1);
      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0]?.id).toBe(`1`);
    });

    await waitFor(() => {
      expect(readCalls).toBeGreaterThan(1);
      expect(item.current).toMatchObject({ id: `1` });
    });
  });

  it(`does not keep a superseded filter after switching input back`, async () => {
    const api = { close: vi.fn(), open: vi.fn() };
    const sync = scope({ api });
    const blockers = new Map<string, () => void>();

    const listProc = leaf(async (input?: { q?: string }) => {
      const q = input?.q ?? ``;
      if (q === `b`) {
        await new Promise<void>(resolve => {
          blockers.set(q, resolve);
        });
      }

      return { items: [{ id: q }] };
    });

    const { rows } = sync.lists({ rows: { list: listProc } });
    await sync.open();
    const { rerender, result } = renderHook(({ q }: { q: string }) => rows({ q }), { initialProps: { q: `a` } });

    await waitFor(() => {
      expect(result.current.items.map(item => item.id)).toStrictEqual([`a`]);
    });

    rerender({ q: `b` });
    await waitFor(() => {
      expect(blockers.has(`b`)).toBe(true);
    });

    rerender({ q: `a` });
    await act(async () => {
      blockers.get(`b`)?.();
      await Promise.resolve();
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(result.current.items.map(item => item.id)).toStrictEqual([`a`]);
    });
  });

  it(`ignores a late list load from a previous open epoch`, async () => {
    const api = { close: vi.fn(), open: vi.fn() };
    const sync = scope({ api });
    const blockers: (() => void)[] = [];
    let listCalls = 0;

    const listProc = leaf(async () => {
      listCalls += 1;
      const n = listCalls;
      if (n === 1) {
        await new Promise<void>(resolve => {
          blockers.push(resolve);
        });
      }

      return { items: [{ id: String(n) }] };
    });

    const { rows } = sync.lists({ rows: { list: listProc } });
    await sync.open();
    const { result } = renderHook(() => rows());

    await waitFor(() => {
      expect(blockers).toHaveLength(1);
    });

    act(() => {
      sync.close();
    });
    await sync.open();

    await waitFor(() => {
      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0]?.id).not.toBe(`1`);
    });

    const afterReopen = result.current.items.map(item => item.id);

    await act(async () => {
      blockers[0]?.();
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(result.current.items.map(item => item.id)).toStrictEqual(afterReopen);
    expect(afterReopen[0]).not.toBe(`1`);
  });

  it(`does not leave unhandled rejection when list reload fails after close`, async () => {
    const api = { close: vi.fn(), open: vi.fn() };
    const sync = scope({ api });
    let fail = false;

    const listProc = leaf(async () => {
      if (fail) {
        throw new Error(`disconnected`);
      }

      return { items: [{ id: `1` }] };
    });

    const { rows } = sync.lists({ rows: { list: listProc } });
    const errors: unknown[] = [];

    const onUnhandled = (reason: unknown) => {
      errors.push(reason);
    };

    process.on(`unhandledRejection`, onUnhandled);
    await sync.open();
    const { result } = renderHook(() => rows());

    await waitFor(() => {
      expect(result.current.items).toHaveLength(1);
    });

    fail = true;
    act(() => {
      sync.close();
    });

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    process.off(`unhandledRejection`, onUnhandled);

    expect(errors).toHaveLength(0);
    expect(result.current.items).toHaveLength(0);
  });
});
