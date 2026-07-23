/* @vitest-environment node */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
import { describe, expect, expectTypeOf, it, vi } from "vitest";
import { z } from "zod";

import type { RpcClient } from "./Types";

import { Procedure } from "./Procedure";
import { Protocol } from "./Protocol";
import { Sync } from "./Sync";

const state = vi.hoisted(() => {
  type Fake = {
    close: () => void;
    emit: (event: string, ...args: unknown[]) => void;
    on: (event: string, listener: (...args: unknown[]) => void) => void;
    send: ReturnType<typeof vi.fn<(data: Buffer | string) => void>>;
  };

  const sockets: Fake[] = [];

  const emit = (index: number, event: string, ...args: unknown[]) => {
    sockets[index]?.emit(event, ...args);
  };

  return { emit, sockets };
});

vi.mock(`./socket/Browser`, () => ({
  Browser: {
    wrap: () => {
      const listeners = new Map<string, Set<(...args: unknown[]) => void>>();

      const on = (event: string, listener: (...args: unknown[]) => void) => {
        const set = listeners.get(event) ?? new Set();
        set.add(listener);
        listeners.set(event, set);
      };

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
        on,
        send: vi.fn(),
      };

      state.sockets.push(fake);

      return fake;
    },
  },
}));

vi.stubGlobal(`WebSocket`, function () {
  return {};
});

vi.stubGlobal(`location`, { host: `example.test`, protocol: `http:` });

const clientModule = await import(`./Client`);
const createClient = clientModule.Client;
const builders = Procedure.scope<object, object>(() => ({}));
const withInput = builders.query(z.object({ n: z.number() }), async ({ input }) => input.n);
const withoutInput = builders.query(async () => `ok`);

type Api = { a: { b: typeof withInput; c: typeof withoutInput } };

const clientOf = () => createClient<Api>({ path: `/rpc` });

describe(`open`, () => {
  it(`connects and flushes queued calls`, async () => {
    state.sockets.length = 0;
    const client = clientOf();
    const pending = client.a.b({ n: 1 });

    expect(state.sockets).toHaveLength(1);
    expect(state.sockets[0]?.send).not.toHaveBeenCalled();

    state.emit(0, `open`);

    expect(state.sockets[0]?.send).toHaveBeenCalledTimes(1);

    const sent = String(state.sockets[0]?.send.mock.calls[0]?.[0]);

    expect(Protocol.parse(sent)).toStrictEqual({ id: `1`, input: { n: 1 }, path: `a.b` });

    state.emit(0, `message`, Protocol.stringify({ data: 2, id: `1`, ok: true }), false);

    await expect(pending).resolves.toBe(2);
  });
});

describe(`close`, () => {
  it(`ignores stale close from a replaced socket`, async () => {
    vi.useFakeTimers();
    state.sockets.length = 0;
    const client = clientOf();
    client.open();
    state.emit(0, `open`);
    const [first] = state.sockets;
    client.close();
    client.open();
    state.emit(1, `open`);

    expect(state.sockets).toHaveLength(2);

    first?.emit(`close`);
    await vi.advanceTimersByTimeAsync(2000);

    expect(state.sockets).toHaveLength(2);
    expect(state.sockets[1]).toBeDefined();

    vi.useRealTimers();
  });

  it(`rejects pending and new calls without unhandled rejections`, async () => {
    state.sockets.length = 0;
    const client = clientOf();
    const errors: unknown[] = [];

    const onUnhandled = (reason: unknown) => {
      errors.push(reason);
    };

    process.on(`unhandledRejection`, onUnhandled);
    const pending = client.a.c();
    state.emit(0, `open`);
    client.close();

    await expect(pending).rejects.toThrow(`disconnected`);
    await expect(client.a.c()).rejects.toThrow(`disconnected`);

    await Promise.resolve();
    process.off(`unhandledRejection`, onUnhandled);

    expect(errors).toHaveLength(0);
  });

  it(`keeps pending calls across disconnect and re-sends on reconnect`, async () => {
    vi.useFakeTimers();
    state.sockets.length = 0;
    const client = clientOf();
    const pending = client.a.c();
    state.emit(0, `open`);
    state.emit(0, `close`);
    await vi.advanceTimersByTimeAsync(2000);
    state.emit(1, `open`);

    expect(state.sockets[1]?.send).toHaveBeenCalledTimes(1);

    state.emit(1, `message`, Protocol.stringify({ data: `ok`, id: `1`, ok: true }), false);

    await expect(pending).resolves.toBe(`ok`);

    vi.useRealTimers();
  });

  it(`does not reuse in-flight keys after disconnect so reseed can send a fresh call`, async () => {
    vi.useFakeTimers();
    state.sockets.length = 0;
    const client = clientOf();
    const first = client.a.c();
    state.emit(0, `open`);
    state.emit(0, `close`);
    await vi.advanceTimersByTimeAsync(2000);
    state.emit(1, `open`);

    expect(state.sockets[1]?.send).toHaveBeenCalledTimes(1);

    const second = client.a.c();

    expect(state.sockets[1]?.send).toHaveBeenCalledTimes(2);

    const resent = Protocol.parse(String(state.sockets[1]?.send.mock.calls[0]?.[0]));
    const fresh = Protocol.parse(String(state.sockets[1]?.send.mock.calls[1]?.[0]));

    expect(resent).toMatchObject({ id: `1`, path: `a.c` });
    expect(fresh).toMatchObject({ id: `2`, path: `a.c` });

    state.emit(1, `message`, Protocol.stringify({ data: `fresh`, id: `2`, ok: true }), false);
    state.emit(1, `message`, Protocol.stringify({ data: `old`, id: `1`, ok: true }), false);

    await expect(second).resolves.toBe(`fresh`);
    await expect(first).resolves.toBe(`old`);

    vi.useRealTimers();
  });
});

describe(`call`, () => {
  it(`deduplicates in-flight calls with the same path and input`, async () => {
    state.sockets.length = 0;
    const client = clientOf();
    const first = client.a.b({ n: 1 });
    const second = client.a.b({ n: 1 });
    const other = client.a.b({ n: 2 });
    state.emit(0, `open`);

    expect(state.sockets[0]?.send).toHaveBeenCalledTimes(2);

    state.emit(0, `message`, Protocol.stringify({ data: 10, id: `1`, ok: true }), false);
    state.emit(0, `message`, Protocol.stringify({ data: 20, id: `2`, ok: true }), false);

    await expect(first).resolves.toBe(10);
    await expect(second).resolves.toBe(10);
    await expect(other).resolves.toBe(20);
  });

  it(`rejects error responses`, async () => {
    state.sockets.length = 0;
    const client = clientOf();
    const pending = client.a.c();
    state.emit(0, `open`);
    state.emit(
      0,
      `message`,
      Protocol.stringify({ error: { code: `BAD_REQUEST`, message: `x` }, id: `1`, ok: false }),
      false,
    );

    await expect(pending).rejects.toThrow(`x`);
  });

  it(`ignores binary and invalid messages`, async () => {
    state.sockets.length = 0;
    const client = clientOf();
    const pending = client.a.c();
    state.emit(0, `open`);
    state.emit(0, `message`, new ArrayBuffer(0), true);
    state.emit(0, `message`, `{`, false);
    state.emit(0, `message`, Protocol.stringify({ data: `ok`, id: `1`, ok: true }), false);

    await expect(pending).resolves.toBe(`ok`);
  });
});

describe(`on`, () => {
  it(`delivers events by seq and supports unsubscribe`, () => {
    state.sockets.length = 0;
    const client = clientOf();
    client.open();
    state.emit(0, `open`);

    const values: number[] = [];

    const off = client.a.b.on(value => {
      values.push(value);
    });

    state.emit(0, `message`, Protocol.stringify({ data: 1, path: `a.b`, seq: 1, type: `event` }), false);
    state.emit(0, `message`, Protocol.stringify({ data: 2, path: `a.b`, seq: 1, type: `event` }), false);
    state.emit(0, `message`, Protocol.stringify({ data: 3, path: `a.b`, seq: 2, type: `event` }), false);
    off();
    state.emit(0, `message`, Protocol.stringify({ data: 4, path: `a.b`, seq: 3, type: `event` }), false);

    expect(values).toStrictEqual([1, 3]);
  });
});

describe(`onReconnect`, () => {
  it(`fires after a later open and clears sequences`, async () => {
    vi.useFakeTimers();
    state.sockets.length = 0;
    const client = clientOf();
    const reconnect = vi.fn();
    client.onReconnect(reconnect);
    client.open();
    state.emit(0, `open`);

    const values: number[] = [];
    client.a.b.on(value => {
      values.push(value);
    });
    state.emit(0, `message`, Protocol.stringify({ data: 1, path: `a.b`, seq: 1, type: `event` }), false);

    state.emit(0, `close`);
    await vi.advanceTimersByTimeAsync(2000);

    expect(state.sockets).toHaveLength(2);

    state.emit(1, `open`);
    state.emit(1, `message`, Protocol.stringify({ data: 2, path: `a.b`, seq: 1, type: `event` }), false);

    expect(reconnect).toHaveBeenCalledTimes(1);
    expect(values).toStrictEqual([1, 2]);

    vi.useRealTimers();
  });
});

describe(`Sync open`, () => {
  it(`reseeds on a later open after an earlier seed fails`, async () => {
    state.sockets.length = 0;
    const client = clientOf();
    const sync = Sync.scope({ api: client });
    const read = Object.assign(async () => client.a.c(), { on: () => () => undefined });
    const amount = sync.mirror(read);
    const first = sync.open();

    await vi.waitFor(() => {
      expect(state.sockets).toHaveLength(1);
    });

    state.emit(0, `open`);
    await first;
    state.emit(
      0,
      `message`,
      Protocol.stringify({ error: { code: `UNAUTHORIZED`, message: `unauthorized` }, id: `1`, ok: false }),
      false,
    );

    await Promise.resolve();
    await Promise.resolve();

    expect(amount()).toBeUndefined();

    const second = sync.open();

    await vi.waitFor(() => {
      expect(state.sockets.length).toBeGreaterThan(1);
    });

    const index = state.sockets.length - 1;
    state.emit(index, `open`);

    const sent = Protocol.parse(String(state.sockets[index]?.send.mock.calls[0]?.[0]));

    expect(sent).toMatchObject({ path: `a.c` });

    const id = sent !== undefined && `id` in sent ? sent.id : `2`;
    state.emit(index, `message`, Protocol.stringify({ data: `ok`, id, ok: true }), false);

    await second;

    await vi.waitFor(() => {
      expect(amount()).toBe(`ok`);
    });
  });
});

describe(`types`, () => {
  it(`infers leaf call and on shapes`, () => {
    expect(Procedure.isProcedure(withInput)).toBe(true);
    expect(Procedure.isProcedure(withoutInput)).toBe(true);

    expectTypeOf<RpcClient<Api>[`a`][`b`]>().parameters.toEqualTypeOf<[{ n: number }]>();
    expectTypeOf<RpcClient<Api>[`a`][`b`]>().returns.toEqualTypeOf<Promise<number>>();
    expectTypeOf<RpcClient<Api>[`a`][`c`]>().parameters.toEqualTypeOf<[]>();
    expectTypeOf<RpcClient<Api>[`a`][`c`]>().returns.toEqualTypeOf<Promise<string>>();
    expectTypeOf<RpcClient<Api>[`a`][`b`][`on`]>().parameters.toEqualTypeOf<[(data: number) => void]>();

    type ClientApi = RpcClient<Api>;

    // @ts-expect-error wrong input shape
    const badInput: Parameters<ClientApi[`a`][`b`]>[0] = { x: 1 };
    // @ts-expect-error leaf without input must not take args
    const badArgs: Parameters<ClientApi[`a`][`c`]> = [`x`];

    expect(badInput).toBeDefined();
    expect(badArgs).toBeDefined();
  });
});
