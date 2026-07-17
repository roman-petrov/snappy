/* @vitest-environment node */
/* eslint-disable vitest/expect-expect */
import { describe, expect, expectTypeOf, it, vi } from "vitest";

import { type DocsFromSync, type ListsFromSync, SyncManifest } from "./SyncManifest";

const { resolve } = SyncManifest;
const leaf = <T>(value: T) => Object.assign(async () => await value, { on: vi.fn(() => () => undefined) });

describe(`resolve`, () => {
  it(`resolves read / readWrite docs and list limit / true`, () => {
    const value = leaf({ id: `1`, n: 1 });
    const get = leaf({ theme: `dark` });
    const set = leaf({ theme: `dark` });
    const list = leaf({ items: [{ id: `1` }] });
    const create = leaf({ id: `1` });
    const api = { a: { create, list }, leaf: value, nest: { get, set }, rows: { create, list } };
    const resolved = resolve(api, { docs: { leaf: `read`, nest: `readWrite` }, lists: { a: 20, rows: true } });

    expect(resolved.docs.leaf).toStrictEqual({ read: value });
    expect(resolved.docs.nest).toStrictEqual({ read: get, write: set });
    expect(resolved.lists.a).toStrictEqual({ create, limit: 20, list });
    expect(resolved.lists.rows).toStrictEqual({ create, list });
  });

  describe(`types`, () => {
    it(`maps docs and list meta from sync`, () => {
      const value = leaf(1);
      const list = leaf({ items: [{ id: `1` }] });
      const api = { a: { list }, leaf: value };
      const sync = { docs: { leaf: `read` as const }, lists: { a: 20 as const } };
      const resolved = resolve(api, sync);

      expectTypeOf(resolved.docs).toEqualTypeOf<DocsFromSync<typeof api, typeof sync>>();
      expectTypeOf(resolved.lists).toEqualTypeOf<ListsFromSync<typeof api, typeof sync>>();
      expectTypeOf(resolved.lists.a.limit).toEqualTypeOf<20>();
    });
  });
});
