import { describe, expect, it, vi } from "vitest";

import { _ } from "./_";

const {
  base64decode,
  camelCase,
  cn,
  dec,
  entries,
  gb,
  gen,
  hex,
  https,
  kb,
  kebabCase,
  keys,
  list,
  mb,
  noop,
  pascalCase,
  px,
  round,
  sentenceCase,
  singleAction,
} = _;

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

describe(`round`, () => {
  it(`rounds to two fraction digits`, () => {
    expect(round(10.126, 2)).toBe(10.13);
    expect(round(10.124, 2)).toBe(10.12);
  });

  it(`rounds to zero fraction digits`, () => {
    expect(round(1.4, 0)).toBe(1);
    expect(round(1.6, 0)).toBe(2);
  });

  it(`rounds negative values`, () => {
    expect(round(-10.126, 2)).toBe(-10.13);
  });

  it(`leaves already rounded two-decimal values unchanged`, () => {
    expect(round(99.99, 2)).toBe(99.99);
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

describe(`https`, () => {
  it(`builds https URL`, () => {
    expect(https(`host/path`)).toBe(`https://host/path`);
    expect(https(`host`)).toBe(`https://host`);
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

describe(`gb`, () => {
  it(`maps 0 GiB to 0 bytes`, () => {
    expect(gb(0)).toBe(0);
  });

  it(`maps 1 GiB to the same bytes as 1024 MiB`, () => {
    expect(gb(1)).toBe(mb(1024));
  });

  it(`maps 0.5 GiB to the same bytes as 512 MiB`, () => {
    expect(gb(0.5)).toBe(mb(512));
  });
});

describe(`gen`, () => {
  it(`creates sequence using index mapper`, () => {
    expect(gen(4, index => index * 2)).toStrictEqual([0, 2, 4, 6]);
  });

  it(`returns empty array for zero count`, () => {
    expect(gen(0, index => index)).toStrictEqual([]);
  });

  it(`returns empty array for negative count`, () => {
    expect(gen(-3, index => index)).toStrictEqual([]);
  });
});

describe(`kb`, () => {
  it(`maps 0 KiB to 0 bytes`, () => {
    expect(kb(0)).toBe(0);
  });

  it(`maps 1 KiB to 1024 bytes`, () => {
    expect(kb(1)).toBe(1024);
  });

  it(`maps 2 KiB to twice 1 KiB`, () => {
    expect(kb(2)).toBe(kb(1) + kb(1));
  });
});

describe(`mb`, () => {
  it(`maps 0 MiB to 0 bytes`, () => {
    expect(mb(0)).toBe(0);
  });

  it(`maps 1 MiB to the same bytes as 1024 KiB`, () => {
    expect(mb(1)).toBe(kb(1024));
  });

  it(`maps 100 MiB to 100 times 1 MiB`, () => {
    expect(mb(100)).toBe(100 * mb(1));
  });
});

describe(`camelCase`, () => {
  it(`converts kebab-case to camelCase`, () => {
    expect(camelCase(`foo-bar-baz`)).toBe(`fooBarBaz`);
  });

  it(`returns camelCase input unchanged`, () => {
    expect(camelCase(`fooBarBaz`)).toBe(`fooBarBaz`);
  });

  it(`returns single word unchanged`, () => {
    expect(camelCase(`word`)).toBe(`word`);
  });

  it(`converts two-part kebab-case`, () => {
    expect(camelCase(`foo-bar`)).toBe(`fooBar`);
  });

  it(`empty input yields empty string`, () => {
    expect(camelCase(``)).toBe(``);
  });
});

describe(`kebabCase`, () => {
  it(`converts PascalCase to kebab-case`, () => {
    expect(kebabCase(`FooBarBaz`)).toBe(`foo-bar-baz`);
  });

  it(`converts camelCase to kebab-case`, () => {
    expect(kebabCase(`fooBarBaz`)).toBe(`foo-bar-baz`);
  });

  it(`normalizes spaces and underscores`, () => {
    expect(kebabCase(`foo_bar baz`)).toBe(`foo-bar-baz`);
  });

  it(`returns kebab-case input unchanged`, () => {
    expect(kebabCase(`foo-bar`)).toBe(`foo-bar`);
  });

  it(`empty input yields empty string`, () => {
    expect(kebabCase(``)).toBe(``);
  });
});

describe(`sentenceCase`, () => {
  it(`converts kebab-case to sentence case`, () => {
    expect(sentenceCase(`foo-bar-baz`)).toBe(`Foo bar baz`);
  });

  it(`capitalizes single word`, () => {
    expect(sentenceCase(`word`)).toBe(`Word`);
  });

  it(`empty input yields empty string`, () => {
    expect(sentenceCase(``)).toBe(``);
  });

  it(`aligns with kebabCase for mixed case and separators`, () => {
    expect(sentenceCase(`FooBarBaz`)).toBe(`Foo bar baz`);
    expect(sentenceCase(`foo_bar baz`)).toBe(`Foo bar baz`);
  });

  it(`collapses repeated hyphens into single spaces`, () => {
    expect(sentenceCase(`foo--bar`)).toBe(`Foo bar`);
  });

  it(`trims and collapses surrounding and repeated whitespace`, () => {
    expect(sentenceCase(`  foo  bar  `)).toBe(`Foo bar`);
  });
});

describe(`px`, () => {
  it(`appends px to integer`, () => {
    expect(px(16)).toBe(`16px`);
  });

  it(`appends px to zero`, () => {
    expect(px(0)).toBe(`0px`);
  });

  it(`appends px to negative and fractional values`, () => {
    expect(px(-4)).toBe(`-4px`);
    expect(px(12.5)).toBe(`12.5px`);
  });
});

describe(`pascalCase`, () => {
  it(`converts kebab-case to PascalCase`, () => {
    expect(pascalCase(`foo-bar-baz`)).toBe(`FooBarBaz`);
  });

  it(`capitalizes camelCase input`, () => {
    expect(pascalCase(`fooBarBaz`)).toBe(`FooBarBaz`);
  });

  it(`capitalizes single word`, () => {
    expect(pascalCase(`word`)).toBe(`Word`);
  });

  it(`converts two-part kebab-case`, () => {
    expect(pascalCase(`foo-bar`)).toBe(`FooBar`);
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
