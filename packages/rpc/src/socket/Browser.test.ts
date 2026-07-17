/* @vitest-environment node */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import { describe, expect, it, vi } from "vitest";

import { Browser } from "./Browser";

const { wrap } = Browser;

const fakeSocket = () => {
  const listeners = new Map<string, Set<(...args: unknown[]) => void>>();

  return {
    addEventListener: (event: string, listener: (...args: unknown[]) => void) => {
      const set = listeners.get(event) ?? new Set();
      set.add(listener);
      listeners.set(event, set);
    },
    close: vi.fn(),
    emit: (event: string, ...args: unknown[]) => {
      for (const listener of listeners.get(event) ?? []) {
        listener(...args);
      }
    },
    send: vi.fn(),
  };
};

describe(`wrap`, () => {
  it(`forwards open close error and string messages`, () => {
    const socket = fakeSocket();
    const raw = wrap(socket as unknown as WebSocket);
    const open = vi.fn();
    const close = vi.fn();
    const error = vi.fn();
    const message = vi.fn();

    raw.on(`open`, open);
    raw.on(`close`, close);
    raw.on(`error`, error);
    raw.on(`message`, message);

    socket.emit(`open`);
    socket.emit(`close`);
    socket.emit(`error`);
    socket.emit(`message`, { data: `hi` });

    expect(open).toHaveBeenCalledTimes(1);
    expect(close).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledTimes(1);
    expect(message).toHaveBeenCalledWith(`hi`, false);

    raw.send(`x`);
    raw.close();

    expect(socket.send).toHaveBeenCalledWith(`x`);
    expect(socket.close).toHaveBeenCalledTimes(1);
  });

  it(`marks binary data and encodes buffer send`, () => {
    const socket = fakeSocket();
    const raw = wrap(socket as unknown as WebSocket);
    const message = vi.fn();
    raw.on(`message`, message);

    const buffer = new ArrayBuffer(2);
    socket.emit(`message`, { data: buffer });
    raw.send(Buffer.from(`ab`));

    expect(message).toHaveBeenCalledWith(buffer, true);
    expect(socket.send).toHaveBeenCalledWith(expect.any(Uint8Array));
  });
});
