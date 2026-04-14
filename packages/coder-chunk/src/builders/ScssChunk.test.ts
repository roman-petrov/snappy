import { describe, expect, it } from "vitest";

import { ScssChunk } from "./ScssChunk";

describe(`ScssChunk`, () => {
  it(`declares extension list`, () => {
    expect(ScssChunk.extensions).toStrictEqual([`.scss`]);
  });

  it(`extracts top-level scss nodes`, () => {
    expect(
      ScssChunk.build({
        path: `style.scss`,
        source: `$c: red;\n.a { color: $c; }\n@media screen { .b { color: blue; } }`,
      }),
    ).toMatchInlineSnapshot(`
      [
        {
          "endLine": 2,
          "path": "style.scss",
          "startLine": 2,
          "text": ".a { color: $c; }",
        },
        {
          "endLine": 3,
          "path": "style.scss",
          "startLine": 3,
          "text": ".b { color: blue; }",
        },
      ]
    `);
  });

  it(`returns empty list for empty scss`, () => {
    expect(ScssChunk.build({ path: `empty.scss`, source: `` })).toMatchInlineSnapshot(`[]`);
  });

  it(`extracts top-level at-rule nodes`, () => {
    expect(ScssChunk.build({ path: `mixins.scss`, source: `@mixin rounded { border-radius: 4px; }` }))
      .toMatchInlineSnapshot(`
        [
          {
            "endLine": 1,
            "path": "mixins.scss",
            "startLine": 1,
            "text": "@mixin rounded { border-radius: 4px; }",
          },
        ]
      `);
  });
});
