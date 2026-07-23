import codeFence from "../fixtures/code-fence.md?raw";
import emphasisStress from "../fixtures/emphasis-stress.md?raw";
import listTableCode from "../fixtures/list-table-code.md?raw";
import showcase from "../fixtures/showcase.md?raw";

export const FixtureIds = [`showcase`, `list-table-code`, `emphasis-stress`, `code-fence`] as const;

export type FixtureId = (typeof FixtureIds)[number];

export const Fixtures = {
  "code-fence": codeFence,
  "emphasis-stress": emphasisStress,
  "list-table-code": listTableCode,
  showcase,
} as const satisfies Record<FixtureId, string>;

export const FixtureShapes = {
  "code-fence": [`h1`, `pre`, `code`, `strong`, `em`],
  "emphasis-stress": [`h1`, `strong`, `em`, `code`, `del`],
  "list-table-code": [`h1`, `table`, `ul`, `ol`, `pre`, `input`],
  "showcase": [
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
} as const satisfies Record<FixtureId, readonly string[]>;
