// cspell:word mred mcyan
import { describe, expect, it } from "vitest";

import { Unicode } from "./Unicode";

const { escape, stripAnsi } = Unicode;

describe(`stripAnsi`, () => {
  it(`returns plain text unchanged`, () => {
    expect(stripAnsi(`hello`)).toBe(`hello`);
  });

  it(`removes color codes`, () => {
    expect(stripAnsi(`${escape}[31mred${escape}[0m`)).toBe(`red`);
  });

  it(`removes multiple and combined codes`, () => {
    expect(stripAnsi(`${escape}[1m${escape}[36mcyan bold${escape}[0m`)).toBe(`cyan bold`);
  });
});
