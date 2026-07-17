/* @vitest-environment node */
/* eslint-disable vitest/expect-expect */
import { describe, expect, expectTypeOf, it } from "vitest";

import { Endpoint } from "./Endpoint";

const { define } = Endpoint;

type Modules = { a: { rpc: object }; leaf: { rpc: object }; nest: { rpc: object } };

describe(`define`, () => {
  it(`keeps path and sync manifest`, () => {
    const contract = define<Modules>()({
      path: `/rpc`,
      sync: { docs: { leaf: `read`, nest: `readWrite` }, lists: { a: 20 } },
    });

    expect(contract.path).toBe(`/rpc`);
    expect(contract.sync).toStrictEqual({ docs: { leaf: `read`, nest: `readWrite` }, lists: { a: 20 } });
  });

  it(`defaults sync to an empty manifest`, () => {
    expect(define<Modules>()({ path: `/rpc` }).sync).toStrictEqual({});
  });

  describe(`types`, () => {
    it(`rejects unknown sync paths`, () => {
      define<Modules>()({
        path: `/rpc`,
        sync: {
          // @ts-expect-error unknown doc path
          docs: { missing: `read` },
        },
      });

      define<Modules>()({
        path: `/rpc`,
        sync: {
          // @ts-expect-error unknown list path
          lists: { missing: true },
        },
      });

      const contract = define<Modules>()({ path: `/rpc`, sync: { docs: { leaf: `read` }, lists: { a: 20 as const } } });

      expectTypeOf(contract.sync).toExtend<{ lists?: { a: 20 } }>();
    });
  });
});
