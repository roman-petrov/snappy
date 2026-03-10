import { describe, expect, it } from "vitest";

import { Cache } from "./Cache";

describe(`get`, () => {
  it(`returns undefined for missing key`, () => {
    const cache = Cache<string>();

    expect(cache.get(`missing`)).toBeUndefined();
  });

  it(`returns value stored by key`, () => {
    const cache = Cache<number>();
    cache.set(`a`, 1);

    expect(cache.get(`a`)).toBe(1);
  });

  it(`returns object value for type T`, () => {
    type Entry = { id: number; name: string };

    const cache = Cache<Entry>();
    const entry: Entry = { id: 1, name: `foo` };
    cache.set(`e`, entry);

    expect(cache.get(`e`)).toStrictEqual(entry);
  });

  it(`isolates instances`, () => {
    const a = Cache<string>();
    const b = Cache<string>();
    a.set(`k`, `from-a`);
    b.set(`k`, `from-b`);

    expect(a.get(`k`)).toBe(`from-a`);
    expect(b.get(`k`)).toBe(`from-b`);
  });
});

describe(`set`, () => {
  it(`returns the stored value`, () => {
    const cache = Cache<string>();
    const value = `x`;

    expect(cache.set(`k`, value)).toBe(value);
  });

  it(`overwrites value for same key`, () => {
    const cache = Cache<number>();
    cache.set(`a`, 1);
    cache.set(`a`, 2);

    expect(cache.get(`a`)).toBe(2);
  });
});

describe(`remove`, () => {
  it(`removes entry`, () => {
    const cache = Cache<number>();
    cache.set(`a`, 1);
    cache.remove(`a`);

    expect(cache.get(`a`)).toBeUndefined();
  });

  it(`is no-op for missing key`, () => {
    const cache = Cache<number>();
    cache.set(`a`, 1);
    cache.remove(`b`);

    expect(cache.get(`a`)).toBe(1);
  });
});
