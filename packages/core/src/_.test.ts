import { describe, expect, test } from "bun:test";

import { _ } from "./_";

describe(`_.base64decode`, () => {
  test(`decodes base64 to UTF-8 string`, () => {
    expect(_.base64decode(`SGVsbG8gd29ybGQ=`)).toBe(`Hello world`);
  });

  test(`decodes empty string`, () => {
    expect(_.base64decode(``)).toBe(``);
  });

  test(`decodes UTF-8 multibyte characters`, () => {
    expect(_.base64decode(`4pyT`)).toBe(`✓`);
  });
});
