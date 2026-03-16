import { describe, expect, it } from "vitest";

import { ObjectValue } from "./ObjectValue";

const { entries, fromEntries, keys } = ObjectValue;

describe(`entries`, () => {
  it(`returns empty array for empty object`, () => {
    expect(entries({})).toStrictEqual([]);
  });

  it(`returns key-value pairs in insertion order`, () => {
    expect(entries({ a: 2, b: 42, c: 1 })).toStrictEqual([
      [`a`, 2],
      [`b`, 42],
      [`c`, 1],
    ]);
  });
});

describe(`fromEntries`, () => {
  it(`converts an empty array to an empty object`, () => {
    expect(fromEntries([])).toStrictEqual({});
  });

  it(`converts an array with key/value pairs into an object`, () => {
    expect(
      fromEntries([
        [`a`, 2],
        [`b`, 42],
        [`c`, 1],
      ]),
    ).toStrictEqual({ a: 2, b: 42, c: 1 });
  });
});

describe(`keys`, () => {
  it(`returns empty array for empty object`, () => {
    expect(keys({})).toStrictEqual([]);
  });

  it(`returns keys in insertion order`, () => {
    expect(keys({ a: 2, b: 42, c: 1 })).toStrictEqual([`a`, `b`, `c`]);
  });
});
