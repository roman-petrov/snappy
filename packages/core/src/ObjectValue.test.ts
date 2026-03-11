import { describe, expect, it } from "vitest";

import { ObjectValue } from "./ObjectValue";

const { fromEntries } = ObjectValue;

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
