import { describe, expect, test } from "vitest";

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

describe(`_.camelCase`, () => {
  test(`converts hyphenated string to camelCase`, () => {
    expect(_.camelCase(`foo-bar-baz`)).toBe(`fooBarBaz`);
  });

  test(`returns input unchanged when it has no hyphens (already camelCase or single word)`, () => {
    expect(_.camelCase(`fooBarBaz`)).toBe(`fooBarBaz`);
    expect(_.camelCase(`word`)).toBe(`word`);
  });

  test(`single hyphen: second part becomes capitalized`, () => {
    expect(_.camelCase(`first-name`)).toBe(`firstName`);
  });

  test(`empty input yields empty string`, () => {
    expect(_.camelCase(``)).toBe(``);
  });
});
