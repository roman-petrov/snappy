import { describe, expect, it } from "vitest";

import { Browser } from "./Browser";

const { isMobile } = Browser;

describe(`isMobile`, () => {
  it(`returns true for Android user agent`, () => {
    expect(isMobile(`Mozilla/5.0 (Linux; Android 10) Chrome/91.0`)).toBe(true);
  });

  it(`returns true for iPhone user agent`, () => {
    expect(isMobile(`Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15`)).toBe(true);
  });

  it(`returns true for iPad user agent`, () => {
    expect(isMobile(`Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15`)).toBe(true);
  });

  it(`returns true for IEMobile user agent`, () => {
    expect(isMobile(`Mozilla/5.0 (Windows Phone 10; IEMobile/10.0)`)).toBe(true);
  });

  it(`returns false for desktop Chrome user agent`, () => {
    expect(isMobile(`Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/91.0`)).toBe(false);
  });

  it(`returns false for empty string`, () => {
    expect(isMobile(``)).toBe(false);
  });
});
