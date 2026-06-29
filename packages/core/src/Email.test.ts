import { describe, expect, it } from "vitest";

import { Email } from "./Email";

const { valid } = Email;

describe(`valid`, () => {
  it(`returns false for empty or whitespace-only input`, () => {
    expect(valid(``)).toBe(false);
    expect(valid(`   `)).toBe(false);
  });

  it(`returns false for malformed addresses`, () => {
    expect(valid(`user`)).toBe(false);
    expect(valid(`user@`)).toBe(false);
    expect(valid(`@example.com`)).toBe(false);
    expect(valid(`user@example`)).toBe(false);
    expect(valid(`user @example.com`)).toBe(false);
  });

  it(`returns true for valid addresses`, () => {
    expect(valid(`user@example.com`)).toBe(true);
    expect(valid(`  user@example.com  `)).toBe(true);
    expect(valid(`user.name+tag@example.co.uk`)).toBe(true);
  });
});
