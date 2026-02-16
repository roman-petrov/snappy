import { describe, expect, test, vi } from "vitest";

import { _ } from "./_";
import { noop } from "./Noop";

const { base64decode, camelCase, list, singleAction } = _;

describe(`base64decode`, () => {
  test(`decodes base64 to UTF-8 string`, () => {
    expect(base64decode(`SGVsbG8gd29ybGQ=`)).toBe(`Hello world`);
  });

  test(`decodes empty string`, () => {
    expect(base64decode(``)).toBe(``);
  });

  test(`decodes UTF-8 multibyte characters`, () => {
    expect(base64decode(`4pyT`)).toBe(`✓`);
  });
});

describe(`camelCase`, () => {
  test(`converts hyphenated string to camelCase`, () => {
    expect(camelCase(`foo-bar-baz`)).toBe(`fooBarBaz`);
  });

  test(`returns input unchanged when it has no hyphens (already camelCase or single word)`, () => {
    expect(camelCase(`fooBarBaz`)).toBe(`fooBarBaz`);
    expect(camelCase(`word`)).toBe(`word`);
  });

  test(`single hyphen: second part becomes capitalized`, () => {
    expect(camelCase(`first-name`)).toBe(`firstName`);
  });

  test(`empty input yields empty string`, () => {
    expect(camelCase(``)).toBe(``);
  });
});

describe(`list`, () => {
  test(`initializes with empty array of items`, () => {
    const { items } = list<object>();

    expect(items()).toHaveLength(0);
  });

  test(`adds items into items array in correct order`, () => {
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

  test(`removes items correctly`, () => {
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

  test(`transforms multiple actions into single action`, () => {
    const action = singleAction([action1, action2]);
    action();

    expect(action1).toHaveBeenCalledTimes(1);
    expect(action2).toHaveBeenCalledTimes(1);
  });
});
