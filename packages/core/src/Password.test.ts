// cspell:word efgh
import { describe, expect, it } from "vitest";

import { Password } from "./Password";

const { strength, valid } = Password;

describe(`strength`, () => {
  it(`returns weak for empty input`, () => {
    expect(strength(``)).toBe(`weak`);
  });

  it(`returns weak for short or uniform passwords`, () => {
    expect(strength(`abc`)).toBe(`weak`);
    expect(strength(`12345678`)).toBe(`weak`);
  });

  it(`returns medium for long enough passwords with two symbol kinds`, () => {
    expect(strength(`abcdefgh`)).toBe(`medium`);
    expect(strength(`abcd1234`)).toBe(`medium`);
  });

  it(`returns strong for long passwords with four symbol kinds`, () => {
    expect(strength(`Abcd1234efgh`)).toBe(`strong`);
    expect(strength(`Abcd1234!efg`)).toBe(`strong`);
  });
});

describe(`valid`, () => {
  it(`returns false for weak passwords`, () => {
    expect(valid(``)).toBe(false);
    expect(valid(`abc`)).toBe(false);
    expect(valid(`12345678`)).toBe(false);
  });

  it(`returns true for medium and strong passwords`, () => {
    expect(valid(`abcdefgh`)).toBe(true);
    expect(valid(`abcd1234`)).toBe(true);
    expect(valid(`Abcd1234efgh`)).toBe(true);
  });
});
