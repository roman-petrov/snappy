/* @vitest-environment jsdom */
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useSiteHeaderState } from "./SiteHeader.state";

describe(`useSiteHeaderState`, () => {
  it(`opens and closes the menu`, () => {
    const { result } = renderHook(useSiteHeaderState);

    expect(result.current.open).toBe(false);

    act(() => {
      result.current.openMenu();
    });

    expect(result.current.open).toBe(true);

    act(() => {
      result.current.close();
    });

    expect(result.current.open).toBe(false);
  });

  it(`locks body scroll while open`, () => {
    const { result } = renderHook(useSiteHeaderState);

    act(() => {
      result.current.openMenu();
    });

    expect(document.body.style.overflow).toBe(`hidden`);

    act(() => {
      result.current.close();
    });

    expect(document.body.style.overflow).toBe(``);
  });

  it(`closes on Escape`, () => {
    const { result } = renderHook(useSiteHeaderState);

    act(() => {
      result.current.openMenu();
    });

    act(() => {
      window.dispatchEvent(new KeyboardEvent(`keydown`, { key: `Escape` }));
    });

    expect(result.current.open).toBe(false);
  });
});
