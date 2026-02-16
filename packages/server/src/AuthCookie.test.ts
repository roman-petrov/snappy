import { describe, expect, test } from "vitest";

import { AuthCookie } from "./AuthCookie";

const { name, token } = AuthCookie;

describe(`name`, () => {
  test(`is "token"`, () => {
    expect(name).toBe(`token`);
  });
});

describe(`token`, () => {
  test(`returns value when single cookie present`, () => {
    expect(token(`token=abc`)).toBe(`abc`);
  });

  test(`returns value when cookie among others`, () => {
    expect(token(`other=xyz; token=abc`)).toBe(`abc`);
    expect(token(`token=abc; other=xyz`)).toBe(`abc`);
  });

  test(`trims value`, () => {
    expect(token(`token=  value  `)).toBe(`value`);
  });

  test(`returns undefined when cookie name absent`, () => {
    expect(token(`other=xyz`)).toBeUndefined();
  });

  test(`returns undefined when header empty`, () => {
    expect(token(``)).toBeUndefined();
  });

  test(`returns undefined when value empty after trim`, () => {
    expect(token(`token=`)).toBeUndefined();
    expect(token(`token=   `)).toBeUndefined();
  });

  test(`matches by prefix only (name=)`, () => {
    expect(token(`token=abc`)).toBe(`abc`);
    expect(token(`token=abc; token_suffix=ignored`)).toBe(`abc`);
  });
});
