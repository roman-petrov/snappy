/* @vitest-environment jsdom */
import { describe, expect, it, vi } from "vitest";

const { bridgeAvailable } = vi.hoisted(() => ({ bridgeAvailable: { value: false } }));

vi.mock(`./Bridge`, () => ({
  Bridge: {
    get available() {
      return bridgeAvailable.value;
    },
  },
}));

vi.stubGlobal(`matchMedia`, (query: string) => ({ matches: false, media: query }));

import { Platform } from "./Platform";

describe(`Platform`, () => {
  it(`returns native in webview`, () => {
    bridgeAvailable.value = true;

    expect(Platform()).toBe(`native`);
  });

  it(`returns mobile-web for mobile user agent`, () => {
    bridgeAvailable.value = false;
    vi.stubGlobal(`navigator`, { userAgent: `Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)` });

    expect(Platform()).toBe(`mobile-web`);
  });

  it(`returns desktop-web for desktop user agent`, () => {
    bridgeAvailable.value = false;
    vi.stubGlobal(`navigator`, { userAgent: `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36` });

    expect(Platform()).toBe(`desktop-web`);
  });
});
