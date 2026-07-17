/* @vitest-environment node */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable vitest/expect-expect */

import { describe, expect, expectTypeOf, it } from "vitest";
import { z } from "zod";

import { Procedure } from "./Procedure";

describe(`scope`, () => {
  const rpc = Procedure.scope<object, object>(() => ({}));

  it(`query is not live`, () => {
    const proc = rpc.query(async () => 1);

    expect(Procedure.isProcedure(proc)).toBe(true);
    expect(Procedure.isLive(proc)).toBe(false);
  });

  it(`mut is live`, () => {
    const proc = rpc.mut(async () => 1);

    expect(Procedure.isLive(proc)).toBe(true);
    expect(proc.sync).toBe(true);
    expect(proc.liveSource).toBeUndefined();
  });

  it(`mut with source attaches liveSource`, () => {
    const channel = { live: () => () => undefined };
    const proc = rpc.mut(channel, async () => 1);

    expect(Procedure.isLive(proc)).toBe(true);
    expect(proc.liveSource).toBe(channel);
  });

  it(`doc is live with liveSource`, () => {
    const channel = { live: () => () => undefined };
    const proc = rpc.doc(channel, async () => 1);

    expect(Procedure.isLive(proc)).toBe(true);
    expect(proc.sync).toBe(true);
    expect(proc.liveSource).toBe(channel);
  });

  it(`doc overrides room without changing payload`, () => {
    const listeners = new Set<(userId: string, data: { id: string; n: number }) => void>();

    const channel = {
      live: (listener: (userId: string, data: { id: string; n: number }) => void) => {
        listeners.add(listener);

        return () => {
          listeners.delete(listener);
        };
      },
    };

    const proc = rpc.doc(channel, { room: `room` }, z.object({ id: z.string() }), async () => ({ id: ``, n: 0 }));
    const pushed: { data: unknown; userId: string }[] = [];
    const { liveSource } = proc;

    expect(liveSource).toBeDefined();

    liveSource?.live((userId, data) => {
      pushed.push({ data, userId });
    });

    for (const listener of listeners) {
      listener(`1`, { id: `1`, n: 42 });
    }

    expect(pushed).toStrictEqual([{ data: { id: `1`, n: 42 }, userId: `room` }]);
  });

  it(`open ignores auth and stays not live`, async () => {
    const proc = rpc.open(async ({ ctx }) => ctx);

    expect(Procedure.isLive(proc)).toBe(false);
    expect(proc.authenticate({})).toStrictEqual({});
    await expect(proc.handle({ auth: {}, ctx: { n: 1 }, input: undefined })).resolves.toStrictEqual({ n: 1 });
  });

  it(`query with schema passes parsed input`, async () => {
    const proc = rpc.query(z.object({ n: z.number() }), async ({ input }) => input.n * 2);

    await expect(proc.handle({ auth: {}, ctx: {}, input: { n: 3 } })).resolves.toBe(6);
  });

  it(`map applies to mut live and return`, async () => {
    const listeners = new Set<(userId: string, data: number) => void>();
    const { mut } = rpc.map((n: number) => n + 1);

    const channel = {
      live: (listener: (userId: string, data: number) => void) => {
        listeners.add(listener);

        return () => {
          listeners.delete(listener);
        };
      },
    };

    const proc = mut(channel, async () => 10);
    const pushed: unknown[] = [];
    proc.liveSource?.live((_userId, data) => {
      pushed.push(data);
    });

    for (const listener of listeners) {
      listener(`u1`, 3);
    }

    expect(pushed).toStrictEqual([4]);
    await expect(proc.handle({ auth: {}, ctx: {}, input: undefined })).resolves.toBe(11);
  });

  it(`map applies to query page items`, async () => {
    const { query } = rpc.map((n: number) => n * 2);
    const proc = query(async () => ({ items: [1, 2], nextCursor: `c` }));

    await expect(proc.handle({ auth: {}, ctx: {}, input: undefined })).resolves.toStrictEqual({
      items: [2, 4],
      nextCursor: `c`,
    });
  });

  it(`map types output as mapped value and page items`, () => {
    const { mut, query } = rpc.map((n: number) => `x${n}` as const);
    const item = mut(async () => 1);
    const page = query(async () => ({ items: [1, 2], nextCursor: `c` as const }));

    expectTypeOf(item).toExtend<{
      handle: (args: { auth: object; ctx: object; input: undefined }) => Promise<`x${number}`>;
    }>();
    expectTypeOf(page).toExtend<{
      handle: (args: {
        auth: object;
        ctx: object;
        input: undefined;
      }) => Promise<{ items: `x${number}`[]; nextCursor: `c` }>;
    }>();
  });

  it(`map preserves handler type when map is shape-preserving`, () => {
    type Row = { id: string; n: number };

    const { query } = rpc.map((row: Row): Row => ({ ...row, n: row.n + 1 }));
    const proc = query(async () => ({ items: [{ id: `1`, n: 1 }] satisfies Row[], nextCursor: undefined }));

    expectTypeOf(proc).toExtend<{
      handle: (args: {
        auth: object;
        ctx: object;
        input: undefined;
      }) => Promise<{ items: Row[]; nextCursor: undefined }>;
    }>();
  });

  describe(`types`, () => {
    it(`types query schema input and open ctx`, () => {
      const withInput = rpc.query(z.object({ n: z.number() }), async ({ input }) => input.n);
      const opened = rpc.open(async ({ ctx }) => ctx);

      expectTypeOf(withInput).toExtend<{
        handle: (args: { auth: object; ctx: object; input: { n: number } }) => Promise<number>;
      }>();
      expectTypeOf(opened).toExtend<{
        handle: (args: { auth: object; ctx: object; input: undefined }) => Promise<object>;
      }>();
    });
  });
});
