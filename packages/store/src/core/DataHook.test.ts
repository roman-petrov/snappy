/* @vitest-environment jsdom */
import { Store } from "@snappy/core";
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DataHook } from "./DataHook";

describe(`DataHook`, () => {
  it(`read returns store value`, () => {
    const $store = Store(0);
    const settings = DataHook($store, value => ({ patch: () => undefined, settings: value }));

    expect(settings.read()).toBe(0);
  });

  it(`call subscribes to store updates`, () => {
    const $store = Store(`a`);
    const settings = DataHook($store, value => ({ settings: value }));
    const { result } = renderHook(() => settings());

    expect(result.current.settings).toBe(`a`);

    act(() => {
      $store.set(`b`);
    });

    expect(result.current.settings).toBe(`b`);
  });
});
