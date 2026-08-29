import { describe, expect, it } from "vitest";

import { Language } from "./Language";

const { resolve } = Language;

describe(`resolve`, () => {
  it(`keeps an explicit locale`, () => {
    expect(resolve(`en`, `ru-RU`)).toBe(`en`);
    expect(resolve(`ru`, `en-US`)).toBe(`ru`);
  });

  it(`follows the system language when unset`, () => {
    expect(resolve(undefined, `en-US,en;q=0.9`)).toBe(`en`);
    expect(resolve(`system`, `ru-RU,ru;q=0.9`)).toBe(`ru`);
  });

  it(`falls back to English when the system language is not Russian`, () => {
    expect(resolve(`system`, `fr-FR`)).toBe(`en`);
    expect(resolve(undefined)).toBe(`en`);
  });
});
