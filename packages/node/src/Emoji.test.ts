import { Unicode } from "@snappy/core";
import { describe, expect, it } from "vitest";

import { Emoji } from "./Emoji";

const { fix } = Emoji;
const buggy = `🛡️`;
const regular = `🌐`;
const label = `Admin`;
const colored = (text: string) => `${Unicode.escape}[33m${text}${Unicode.escape}[0m`;

describe(`fix`, () => {
  it.each([
    { expected: `hello`, input: `hello`, name: `plain text` },
    { expected: `${regular} ${label}`, input: `${regular} ${label}`, name: `regular emoji` },
    { expected: `${buggy}  ${label}`, input: `${buggy}${label}`, name: `touching text` },
    { expected: `${buggy}  ${label}`, input: `${buggy} ${label}`, name: `single space` },
    { expected: `${buggy}  ${label}`, input: `${buggy}  ${label}`, name: `double space` },
    { expected: `${buggy}  ${colored(`${label}:`)}`, input: `${buggy} ${colored(`${label}:`)}`, name: `ansi gap` },
  ])(`$name`, ({ expected, input }) => {
    expect(fix(input)).toBe(expected);
  });
});
