import { BrowserChrome } from "@snappy/app-router";
import { describe, expect, it } from "vitest";

const clearThemeColor = () => {
  for (const node of document.head.querySelectorAll(`meta[name="theme-color"]`)) {
    node.remove();
  }
};

describe(`apply`, () => {
  it(`creates a theme-color meta tag`, () => {
    clearThemeColor();
    const { apply } = BrowserChrome();
    apply(`#112233`);

    const meta = document.querySelector(`meta[name="theme-color"]`);

    expect(meta?.getAttribute(`content`)).toBe(`rgb(17, 34, 51)`);
  });

  it(`updates an existing theme-color meta tag`, () => {
    clearThemeColor();
    const { apply } = BrowserChrome();
    const existing = document.createElement(`meta`);
    existing.name = `theme-color`;
    existing.content = `#000000`;
    document.head.append(existing);

    apply(`#ffffff`);

    expect(document.querySelectorAll(`meta[name="theme-color"]`)).toHaveLength(1);
    expect(existing.getAttribute(`content`)).toBe(`rgb(255, 255, 255)`);
  });

  it(`skips writes when the resolved color is unchanged`, () => {
    clearThemeColor();
    const { apply } = BrowserChrome();
    apply(`#445566`);

    const meta = document.querySelector(`meta[name="theme-color"]`);
    const first = meta?.getAttribute(`content`);

    apply(`#445566`);

    expect(meta?.getAttribute(`content`)).toBe(first);
  });
});

describe(`reset`, () => {
  it(`writes the backdrop css to meta`, () => {
    clearThemeColor();
    const { reset } = BrowserChrome();
    document.documentElement.style.setProperty(`--color-backdrop`, `#abcdef`);

    reset();

    expect(document.querySelector(`meta[name="theme-color"]`)?.getAttribute(`content`)).toBe(`var(--color-backdrop)`);

    document.documentElement.style.removeProperty(`--color-backdrop`);
  });
});

describe(`sync`, () => {
  it(`re-applies the active override`, () => {
    clearThemeColor();
    const { apply, reset, sync } = BrowserChrome();
    apply(`#112233`);
    reset();
    apply(`#445566`);

    sync();

    expect(document.querySelector(`meta[name="theme-color"]`)?.getAttribute(`content`)).toBe(`rgb(68, 85, 102)`);
  });

  it(`falls back to backdrop when override is cleared`, () => {
    clearThemeColor();
    const { apply, reset, sync } = BrowserChrome();
    apply(`#112233`);
    reset();

    sync();

    expect(document.querySelector(`meta[name="theme-color"]`)?.getAttribute(`content`)).toBe(`var(--color-backdrop)`);
  });
});
