import { Store } from "@snappy/core";
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useStoreValue } from "./useStoreValue";

describe(`useStoreValue`, () => {
  it(`returns initial value from store`, () => {
    const userStore = Store({ email: `alice@example.com`, id: 1, name: `Alice` });
    const { result } = renderHook(() => useStoreValue(userStore.map(user => user.email)));

    expect(result.current).toBe(`alice@example.com`);
  });

  it(`updates value when store changes through map transformation`, () => {
    const userStore = Store({ email: `alice@example.com`, id: 1, name: `Alice` });
    const { result } = renderHook(() => useStoreValue(userStore.map(user => user.email)));

    expect(result.current).toBe(`alice@example.com`);

    act(() => {
      userStore.set({ email: `bob@example.com`, id: 2, name: `Bob` });
    });

    expect(result.current).toBe(`bob@example.com`);
  });

  it(`does not update when filtered value remains the same`, () => {
    const userStore = Store({ email: `alice@example.com`, id: 1, name: `Alice` });

    const { result } = renderHook(() =>
      useStoreValue(userStore.map(user => user.email.toLowerCase()).filter((a, b) => a === b)),
    );

    expect(result.current).toBe(`alice@example.com`);

    act(() => {
      userStore.set({ email: `ALICE@EXAMPLE.COM`, id: 1, name: `Alice` });
    });

    expect(result.current).toBe(`alice@example.com`);

    act(() => {
      userStore.set({ email: `bob@example.com`, id: 2, name: `Bob` });
    });

    expect(result.current).toBe(`bob@example.com`);
  });

  it(`supports chaining multiple map transformations`, () => {
    const userStore = Store({ email: `alice@example.com`, id: 1, name: `Alice` });

    const { result } = renderHook(() =>
      useStoreValue(userStore.map(user => user.email).map(email => email.split(`@`)[1] ?? ``)),
    );

    expect(result.current).toBe(`example.com`);

    act(() => {
      userStore.set({ email: `alice@company.com`, id: 1, name: `Alice` });
    });

    expect(result.current).toBe(`company.com`);
  });

  it(`applies custom filter function to ignore case differences`, () => {
    const userStore = Store({ id: 1, name: `Alice` });

    const { result } = renderHook(() =>
      useStoreValue(userStore.map(user => user.name).filter((a, b) => a.toLowerCase() === b.toLowerCase())),
    );

    expect(result.current).toBe(`Alice`);

    act(() => {
      userStore.set({ id: 1, name: `ALICE` });
    });

    expect(result.current).toBe(`Alice`);

    act(() => {
      userStore.set({ id: 1, name: `Bob` });
    });

    expect(result.current).toBe(`Bob`);
  });
});
