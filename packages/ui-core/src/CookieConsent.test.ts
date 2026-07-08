/* @vitest-environment jsdom */
/* eslint-disable unicorn/no-document-cookie */
import { describe, expect, it, vi } from "vitest";

import { CookieConsent } from "./CookieConsent";

const { cookieSet } = vi.hoisted(() => ({
  cookieSet: vi.fn(({ name, path, value }: { expires: number; name: string; path: string; value: string }) => {
    document.cookie = `${name}=${value}; path=${path}`;
  }),
}));

vi.stubGlobal(`cookieStore`, { set: cookieSet });

const clearConsent = () => {
  document.cookie = `cookie-consent=; max-age=0; path=/`;
};

describe(`given`, () => {
  it(`returns true after accept`, () => {
    CookieConsent.accept();

    expect(CookieConsent.given()).toBe(true);
  });

  it(`returns false for other value`, () => {
    document.cookie = `cookie-consent=0; path=/`;

    expect(CookieConsent.given()).toBe(false);
  });

  it(`returns false when cookie is absent`, () => {
    clearConsent();

    expect(CookieConsent.given()).toBe(false);
  });
});

describe(`missing`, () => {
  it(`returns true when cookie is absent`, () => {
    clearConsent();

    expect(CookieConsent.missing()).toBe(true);
  });

  it(`returns false after accept`, () => {
    CookieConsent.accept();

    expect(CookieConsent.missing()).toBe(false);
  });
});

describe(`accept`, () => {
  it(`sets consent via cookieStore`, () => {
    cookieSet.mockClear();
    CookieConsent.accept();

    expect(cookieSet).toHaveBeenCalledWith(expect.objectContaining({ name: `cookie-consent`, path: `/`, value: `1` }));
  });
});
