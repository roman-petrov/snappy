import { describe, expect, it } from "vitest";

import { AuthCookie } from "./AuthCookie";

const { name, token } = AuthCookie;

describe(`name`, () => {
  it(`is "token"`, () => {
    expect(name).toBe(`token`);
  });
});

describe(`token`, () => {
  it(`returns value when single cookie present`, () => {
    expect(token(`token=abc`)).toBe(`abc`);
  });

  it(`returns value when cookie among others`, () => {
    expect(token(`other=xyz; token=abc`)).toBe(`abc`);
    expect(token(`token=abc; other=xyz`)).toBe(`abc`);
  });

  it(`trims value`, () => {
    expect(token(`token=  value  `)).toBe(`value`);
  });

  it(`returns undefined when cookie name absent`, () => {
    expect(token(`other=xyz`)).toBeUndefined();
  });

  it(`returns undefined when header empty`, () => {
    expect(token(``)).toBeUndefined();
  });

  it(`returns undefined when value empty after trim`, () => {
    expect(token(`token=`)).toBeUndefined();
    expect(token(`token=   `)).toBeUndefined();
  });

  it(`matches by prefix only (name=)`, () => {
    expect(token(`token=abc`)).toBe(`abc`);
    expect(token(`token=abc; token_suffix=ignored`)).toBe(`abc`);
  });
});
