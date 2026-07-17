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
