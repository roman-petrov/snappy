/* @vitest-environment node */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
import { describe, expect, expectTypeOf, it, vi } from "vitest";
import { z } from "zod";

import type { RpcClient } from "./Types";

import { Procedure } from "./Procedure";
import { Protocol } from "./Protocol";

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
  it(`rejects new calls after close and does not leave unhandled rejections`, async () => {
    state.sockets.length = 0;
    const client = clientOf();
    const errors: unknown[] = [];

    const onUnhandled = (reason: unknown) => {
      errors.push(reason);
    };

    process.on(`unhandledRejection`, onUnhandled);
    void client.a.c();
    state.emit(0, `open`);
    client.close();

    await expect(client.a.c()).rejects.toThrow(`disconnected`);

    await Promise.resolve();
    process.off(`unhandledRejection`, onUnhandled);

    expect(errors).toHaveLength(0);
  });

  it(`rejects pending calls on unexpected disconnect`, async () => {
    state.sockets.length = 0;
    const client = clientOf();
    const pending = client.a.c();
    state.emit(0, `open`);
    state.emit(0, `close`);

    await expect(pending).rejects.toThrow(`disconnected`);
  });
});

describe(`call`, () => {
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
