import { describe, expect, it } from "vitest";

import { Table } from "./Table";
import { Unicode } from "./Unicode";

const { format } = Table;
const red = `${Unicode.escape}[31m`;
const reset = `${Unicode.escape}[0m`;

describe(`format`, () => {
  it(`returns empty string for no rows`, () => {
    expect(format([])).toBe(``);
  });

  it(`aligns columns by visible width`, () => {
    expect(
      format([
        [`name`, `description`],
        [`lint`, `Check all.`],
        [`tsc`, `TypeScript.`],
      ]),
    ).toBe([`name  description`, `lint  Check all. `, `tsc   TypeScript.`].join(`\n`));
  });

  it(`ignores ansi when calculating column width`, () => {
    expect(
      format([
        [`${red}name${reset}`, `description`],
        [`lint`, `Check all.`],
      ]),
    ).toBe([`${red}name${reset}  description`, `lint  Check all. `].join(`\n`));
  });

  it(`treats missing cells as empty`, () => {
    expect(format([[`only`], [`a`, `b`]])).toBe([`only`, `a     b`].join(`\n`));
  });
});
