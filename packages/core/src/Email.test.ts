import { describe, expect, it } from "vitest";

import { Email } from "./Email";

const { mailto, valid } = Email;

describe(`valid`, () => {
  it(`returns false for empty or whitespace-only input`, () => {
    expect(valid(``)).toBe(false);
    expect(valid(` `.repeat(3))).toBe(false);
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

describe(`mailto`, () => {
  it(`returns mailto href for email`, () => {
    expect(mailto(`user@example.com`)).toBe(`mailto:user@example.com`);
    expect(mailto(`  user@example.com  `)).toBe(`mailto:user@example.com`);
  });

  it(`appends encoded subject and body`, () => {
    expect(mailto(`user@example.com`, { subject: `Hello` })).toBe(`mailto:user@example.com?subject=Hello`);
    expect(mailto(`user@example.com`, { body: `Line 1\nLine 2`, subject: `Pay #1` })).toBe(
      `mailto:user@example.com?subject=Pay%20%231&body=Line%201%0ALine%202`,
    );
  });
});
