/* @vitest-environment jsdom */
import { Store } from "@snappy/core";
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ReactiveStore } from "./ReactiveStore";

describe(`ReactiveStore`, () => {
  it(`read returns store value`, () => {
    const $store = Store(0);
    const slice = ReactiveStore($store, { inc: () => $store.set($store() + 1) });

    expect(slice.read()).toBe(0);

    slice.inc();

    expect(slice.read()).toBe(1);
  });

  it(`use subscribes to store updates`, () => {
    const $store = Store(`a`);
    const slice = ReactiveStore($store, {});
    const { result } = renderHook(() => slice.use());

    expect(result.current).toBe(`a`);

    act(() => {
      $store.set(`b`);
    });

    expect(result.current).toBe(`b`);
  });
});
