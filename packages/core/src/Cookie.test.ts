import { describe, expect, it } from "vitest";

import { Cookie } from "./Cookie";

describe(`value`, () => {
  it(`returns undefined when header is undefined`, () => {
    expect(Cookie.value(undefined, `a`)).toBeUndefined();
  });

  it(`returns cookie value by name`, () => {
    expect(Cookie.value(`locale=en; theme=dark`, `locale`)).toBe(`en`);
  });

  it(`trims parts`, () => {
    expect(Cookie.value(` locale=en ; theme=dark `, `theme`)).toBe(`dark`);
  });

  it(`handles value with equals sign`, () => {
    expect(Cookie.value(`token=abc=def`, `token`)).toBe(`abc=def`);
  });
});

describe(`decoded`, () => {
  it(`decodes encoded value`, () => {
    expect(Cookie.decoded(`session=${encodeURIComponent(`a+b`)}`, `session`)).toBe(`a+b`);
  });
});
