/* @vitest-environment node */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable func-names */
/* eslint-disable object-shorthand */
import { describe, expect, it, vi } from "vitest";

import { Socket } from "./Socket";

const { node, reconnect } = Socket;

const state = vi.hoisted(() => {
  type Fake = {
    close: ReturnType<typeof vi.fn>;
    emit: (event: string, ...args: unknown[]) => void;
    on: (event: string, listener: (...args: unknown[]) => void) => void;
  };

  const sockets: Fake[] = [];

  return { sockets };
});

vi.mock(`ws`, () => ({
  default: function () {
    const listeners = new Map<string, Set<(...args: unknown[]) => void>>();

    const fake = {
      close: vi.fn(() => {
        for (const listener of listeners.get(`close`) ?? []) {
          listener();
        }
      }),
      emit: (event: string, ...args: unknown[]) => {
        for (const listener of listeners.get(event) ?? []) {
          listener(...args);
        }
      },
      on: (event: string, listener: (...args: unknown[]) => void) => {
        const set = listeners.get(event) ?? new Set();
        set.add(listener);
        listeners.set(event, set);
      },
      send: vi.fn(),
    };

    state.sockets.push(fake);

    return fake;
  },
}));

describe(`node`, () => {
  it(`forwards send and close`, () => {
    const send = vi.fn();
    const close = vi.fn();
    const on = vi.fn();
    const raw = node({ close, on, send } as never);

    raw.send(`hi`);
    raw.close();

    expect(send).toHaveBeenCalledWith(`hi`);
    expect(close).toHaveBeenCalledTimes(1);
    expect(on).not.toHaveBeenCalled();
  });

  it(`forwards message open and close listeners`, () => {
    const listeners = new Map<string, Set<(...args: unknown[]) => void>>();

    const on = (event: string, listener: (...args: unknown[]) => void) => {
      const set = listeners.get(event) ?? new Set();
      set.add(listener);
      listeners.set(event, set);
    };

    const raw = node({ close: vi.fn(), on, send: vi.fn() } as never);
    const message = vi.fn();
    const open = vi.fn();
    const close = vi.fn();

    raw.on(`message`, message);
    raw.on(`open`, open);
    raw.on(`close`, close);

    for (const listener of listeners.get(`message`) ?? []) {
      listener(`x`, false);
    }

    for (const listener of listeners.get(`open`) ?? []) {
      listener();
    }

    for (const listener of listeners.get(`close`) ?? []) {
      listener();
    }

    expect(message).toHaveBeenCalledWith(`x`, false);
    expect(open).toHaveBeenCalledTimes(1);
    expect(close).toHaveBeenCalledTimes(1);
  });
});

describe(`reconnect`, () => {
  it(`schedules another socket after close and stops`, async () => {
    vi.useFakeTimers();
    state.sockets.length = 0;
    const onSocket = vi.fn(() => undefined);
    const handle = reconnect({ delayMs: 10, onSocket, url: `ws://example.test` });

    expect(state.sockets).toHaveLength(1);
    expect(onSocket).toHaveBeenCalledTimes(1);

    state.sockets[0]?.emit(`close`);
    await vi.advanceTimersByTimeAsync(10);

    expect(state.sockets).toHaveLength(2);
    expect(onSocket).toHaveBeenCalledTimes(2);

    handle.stop();
    state.sockets[1]?.emit(`close`);
    await vi.advanceTimersByTimeAsync(10);

    expect(state.sockets).toHaveLength(2);

    vi.useRealTimers();
  });
});
