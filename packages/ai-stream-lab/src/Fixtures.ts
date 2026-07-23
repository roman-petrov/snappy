import code from "../fixtures/code.md?raw";
import emphasis from "../fixtures/emphasis.md?raw";
import headings from "../fixtures/headings.md?raw";
import links from "../fixtures/links.md?raw";
import lists from "../fixtures/lists.md?raw";
import quotes from "../fixtures/quotes.md?raw";
import showcase from "../fixtures/showcase.md?raw";
import table from "../fixtures/table.md?raw";

export const FixtureIds = [`showcase`, `emphasis`, `code`, `table`, `lists`, `quotes`, `links`, `headings`] as const;

export type FixtureId = (typeof FixtureIds)[number];

export const Fixtures = { code, emphasis, headings, links, lists, quotes, showcase, table } as const satisfies Record<
  FixtureId,
  string
>;

export const FixtureShapes = {
  code: [`h1`, `pre`, `code`, `strong`, `em`],
  emphasis: [`h1`, `strong`, `em`, `code`, `del`],
  headings: [`h1`, `h2`, `h3`, `h4`, `ol`, `strong`, `em`, `code`],
  links: [`h1`, `a`, `strong`, `em`, `code`],
  lists: [`h1`, `ul`, `ol`, `input`, `strong`, `em`, `code`],
  quotes: [`h1`, `blockquote`, `ul`, `strong`, `em`, `code`, `del`],
  showcase: [
    `h1`,
    `h2`,
    `h3`,
    `h4`,
    `table`,
    `pre`,
    `ul`,
    `ol`,
    `blockquote`,
    `strong`,
    `em`,
    `del`,
    `code`,
    `a`,
    `hr`,
    `input`,
  ],
  table: [`h1`, `table`, `strong`, `em`, `code`, `del`],
} as const satisfies Record<FixtureId, readonly string[]>;
