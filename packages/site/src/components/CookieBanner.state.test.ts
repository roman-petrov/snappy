/* eslint-disable unicorn/no-document-cookie */
/* eslint-disable @typescript-eslint/require-await */
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useCookieBannerState } from "./CookieBanner.state";

vi.stubGlobal(`cookieStore`, {
  set: async ({ name, path, value }: { name: string; path: string; value: string }) => {
    document.cookie = `${name}=${value}; path=${path}`;
  },
});

describe(`useCookieBannerState`, () => {
  it(`shows the banner when consent was not given yet`, () => {
    document.cookie = `cookie-consent=; max-age=0; path=/`;
    const { result } = renderHook(useCookieBannerState);

    expect(result.current.visible).toBe(true);
  });

  it(`does not show the banner when consent was already given`, () => {
    document.cookie = `cookie-consent=1; path=/`;
    const { result } = renderHook(useCookieBannerState);

    expect(result.current.visible).toBe(false);
  });

  it(`hides the banner and stores consent after accept`, () => {
    document.cookie = `cookie-consent=; max-age=0; path=/`;
    const { result } = renderHook(useCookieBannerState);

    act(() => {
      result.current.accept();
    });

    expect(result.current.visible).toBe(false);
    expect(document.cookie).toContain(`cookie-consent=1`);
  });
});
