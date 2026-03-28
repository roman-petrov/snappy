/* eslint-disable unicorn/no-null  */
import { describe, expect, it, vi } from "vitest";

import { ReactRef } from "./ReactRef";

const { merge } = ReactRef;

describe(`merge`, () => {
  it(`returns a function that no-ops when no refs are passed`, () => {
    const merged = merge();

    expect(() => merged(null)).not.toThrow();
  });

  it(`invokes a callback ref with the node`, () => {
    const fn = vi.fn();
    const merged = merge(fn);
    const element = document.createElement(`div`);

    merged(element);

    expect(fn).toHaveBeenCalledTimes(1);

    expect(fn).toHaveBeenCalledWith(element);
  });

  it(`invokes a callback ref with null when clearing`, () => {
    const fn = vi.fn();
    const merged = merge(fn);

    merged(null);

    expect(fn).toHaveBeenCalledWith(null);
  });

  it(`assigns an object ref .current`, () => {
    const ref: { current: HTMLDivElement | null } = { current: null };
    const merged = merge(ref);
    const element = document.createElement(`div`);

    merged(element);

    expect(ref.current).toBe(element);
  });

  it(`clears an object ref when node is null`, () => {
    const element = document.createElement(`div`);
    const ref: { current: HTMLDivElement | null } = { current: element };
    const merged = merge(ref);

    merged(null);

    expect(ref.current).toBeNull();
  });

  it(`skips null and undefined refs`, () => {
    const fn = vi.fn();
    const merged = merge(undefined, null, fn);
    const element = document.createElement(`div`);

    merged(element);

    expect(fn).toHaveBeenCalledWith(element);
  });

  it(`updates every ref in order`, () => {
    const a = vi.fn();
    const b: { current: HTMLDivElement | null } = { current: null };
    const c = vi.fn();
    const element = document.createElement(`div`);

    merge(a, b, c)(element);

    expect(a).toHaveBeenCalledWith(element);

    expect(b.current).toBe(element);

    expect(c).toHaveBeenCalledWith(element);
  });
});
