/* eslint-disable unicorn/no-null */
import { describe, expect, it } from "vitest";

import { Json } from "./Json";

const { parse, stringify } = Json;

describe(`stringify`, () => {
  it(`converts undefined to null deeply`, () => {
    const value = {
      profile: { displayName: undefined },
      retryCount: 1,
      tags: [undefined, 2, { lastErrorMessage: undefined }],
      userName: undefined,
    };

    expect(stringify(value)).toBe(
      JSON.stringify({
        profile: { displayName: null },
        retryCount: 1,
        tags: [null, 2, { lastErrorMessage: null }],
        userName: null,
      }),
    );
  });
});

describe(`parse`, () => {
  it(`converts null to undefined deeply`, () => {
    const json = JSON.stringify({
      profile: { displayName: null },
      retryCount: 1,
      tags: [null, 2, { lastErrorMessage: null }],
      userName: null,
    });

    expect(parse(json)).toStrictEqual({
      profile: { displayName: undefined },
      retryCount: 1,
      tags: [undefined, 2, { lastErrorMessage: undefined }],
      userName: undefined,
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
