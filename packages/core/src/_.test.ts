import { describe, expect, it, vi } from "vitest";

import { _ } from "./_";

const { base64decode, camelCase, cn, dec, entries, hex, keys, list, noop, pascalCase, singleAction } = _;

describe(`base64decode`, () => {
  it(`decodes base64 to UTF-8 string`, () => {
    expect(base64decode(`SGVsbG8gd29ybGQ=`)).toBe(`Hello world`);
  });

  it(`decodes empty string`, () => {
    expect(base64decode(``)).toBe(``);
  });

  it(`decodes UTF-8 multibyte characters`, () => {
    expect(base64decode(`4pyT`)).toBe(`✓`);
  });
});

describe(`cn`, () => {
  it(`joins non-empty strings with space`, () => {
    expect(cn(`a`, `b`, `c`)).toBe(`a b c`);
  });

  it(`filters out falsy and empty string`, () => {
    expect(cn(`a`, ``, undefined, `b`, false, `c`)).toBe(`a b c`);
  });

  it(`returns empty string when all falsy`, () => {
    expect(cn(undefined, ``, false)).toBe(``);
  });

  it(`trims leading and trailing space of result`, () => {
    expect(cn(`  a`, `b  `)).toBe(`a b`);
  });

  it(`single part returns as-is (trimmed)`, () => {
    expect(cn(`foo`)).toBe(`foo`);
  });
});

describe(`dec`, () => {
  it(`parses decimal string to number`, () => {
    expect(dec(`42`)).toBe(42);
  });

  it(`parses negative decimal`, () => {
    expect(dec(`-10`)).toBe(-10);
  });

  it(`returns undefined for non-numeric string`, () => {
    expect(dec(`ff`)).toBeUndefined();
  });
});

describe(`hex`, () => {
  it(`parses hex string to number`, () => {
    expect(hex(`ff`)).toBe(255);
  });

  it(`parses hex with leading zeros`, () => {
    expect(hex(`0010`)).toBe(16);
  });

  it(`returns undefined for invalid hex`, () => {
    expect(hex(`gg`)).toBeUndefined();
  });
});

describe(`camelCase`, () => {
  it(`converts hyphenated string to camelCase`, () => {
    expect(camelCase(`foo-bar-baz`)).toBe(`fooBarBaz`);
  });

  it(`returns input unchanged when it has no hyphens (already camelCase or single word)`, () => {
    expect(camelCase(`fooBarBaz`)).toBe(`fooBarBaz`);
    expect(camelCase(`word`)).toBe(`word`);
  });

  it(`single hyphen: second part becomes capitalized`, () => {
    expect(camelCase(`first-name`)).toBe(`firstName`);
  });

  it(`empty input yields empty string`, () => {
    expect(camelCase(``)).toBe(``);
  });
});

describe(`pascalCase`, () => {
  it(`converts hyphenated string to PascalCase`, () => {
    expect(pascalCase(`foo-bar-baz`)).toBe(`FooBarBaz`);
  });

  it(`capitalizes first letter of camelCase input`, () => {
    expect(pascalCase(`fooBarBaz`)).toBe(`FooBarBaz`);
  });

  it(`single word: first letter uppercase`, () => {
    expect(pascalCase(`word`)).toBe(`Word`);
  });

  it(`single hyphen: both parts capitalized`, () => {
    expect(pascalCase(`first-name`)).toBe(`FirstName`);
  });

  it(`empty input yields empty string`, () => {
    expect(pascalCase(``)).toBe(``);
  });
});

describe(`entries`, () => {
  it(`converts an empty object to an empty array`, () => {
    expect(entries({})).toStrictEqual([]);
  });

  it(`converts an object to an array with its keys and values`, () => {
    expect(entries({ a: 2, b: 42, c: 1 })).toStrictEqual([
      [`a`, 2],
      [`b`, 42],
      [`c`, 1],
    ]);
  });
});

describe(`keys`, () => {
  it(`converts an empty object to an empty array`, () => {
    expect(keys({})).toStrictEqual([]);
  });

  it(`converts an object to array with object keys`, () => {
    expect(keys({ a: 2, b: 42, c: 1 })).toStrictEqual([`a`, `b`, `c`]);
  });
});

describe(`list`, () => {
  it(`initializes with empty array of items`, () => {
    const { items } = list<object>();

    expect(items()).toHaveLength(0);
  });

  it(`adds items into items array in correct order`, () => {
    const { add, items } = list<object>();
    const item1 = {};
    const item2 = {};
    const item3 = {};
    add(item3);
    add(item1);
    add(item2);

    expect(items()).toHaveLength(3);
    expect(items().indexOf(item3)).toBe(0);
    expect(items().indexOf(item1)).toBe(1);
    expect(items().indexOf(item2)).toBe(2);
  });

  it(`removes items correctly`, () => {
    const { add, items } = list<object>();
    const item1 = {};
    const item2 = {};
    const item3 = {};
    add(item3);
    const removeItem1 = add(item1);
    add(item2);
    removeItem1();

    expect(items()).toHaveLength(2);
    expect(items().indexOf(item3)).toBe(0);
    expect(items().indexOf(item1)).toBe(-1);
    expect(items().indexOf(item2)).toBe(1);
  });
});

describe(`singleAction`, () => {
  const action1 = vi.fn(noop);
  const action2 = vi.fn(noop);

  it(`transforms multiple actions into single action`, () => {
    const action = singleAction([action1, action2]);
    action();

    expect(action1).toHaveBeenCalledTimes(1);
    expect(action2).toHaveBeenCalledTimes(1);
  });
});
