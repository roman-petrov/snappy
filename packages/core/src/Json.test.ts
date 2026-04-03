/* eslint-disable unicorn/no-null */
import { describe, expect, it } from "vitest";

import { Json } from "./Json";

const { normalize, parse, stringify } = Json;

describe(`stringify`, () => {
  it(`converts undefined to null deeply`, () => {
    const value = {
      cart: { title: undefined },
      checkoutId: undefined,
      itemCount: 2,
      lines: [undefined, 1, { discountLabel: undefined }],
    };

    expect(stringify(value)).toBe(
      JSON.stringify({
        cart: { title: null },
        checkoutId: null,
        itemCount: 2,
        lines: [null, 1, { discountLabel: null }],
      }),
    );
  });
});

describe(`parse`, () => {
  it(`converts null to undefined deeply`, () => {
    const json = JSON.stringify({
      cart: { title: null },
      checkoutId: null,
      itemCount: 2,
      lines: [null, 1, { discountLabel: null }],
    });

    expect(parse(json)).toStrictEqual({
      cart: { title: undefined },
      checkoutId: undefined,
      itemCount: 2,
      lines: [undefined, 1, { discountLabel: undefined }],
    });
  });

  it(`keeps primitives as-is`, () => {
    expect([parse(JSON.stringify(42)), parse(JSON.stringify(`foo`)), parse(JSON.stringify(true))]).toStrictEqual([
      42,
      `foo`,
      true,
    ]);
  });
});

describe(`normalize`, () => {
  it(`converts null to undefined deeply`, () => {
    expect(
      normalize({ cart: { title: null }, checkoutId: null, itemCount: 2, lines: [null, 1, { discountLabel: null }] }),
    ).toStrictEqual({
      cart: { title: undefined },
      checkoutId: undefined,
      itemCount: 2,
      lines: [undefined, 1, { discountLabel: undefined }],
    });
  });
});
