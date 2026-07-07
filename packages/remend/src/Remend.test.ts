import { _ } from "@snappy/core";
import { describe, expect, it } from "vitest";

import { Remend } from "./Remend";

const { apply } = Remend;

describe(`apply`, () => {
  it(`handles very long prose with numeric line prefixes`, () => {
    const input = [
      `Section title`,
      ``,
      _.gen(800, index => `${index + 1}. Plain rule line ${index + 1}.`).join(`\n`),
      ``,
      `Tail`,
    ].join(`\n`);

    expect(apply(input)).toBe(input);
  });
});
