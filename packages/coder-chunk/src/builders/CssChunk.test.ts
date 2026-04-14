import { describe, expect, it } from "vitest";

import { CssChunk } from "./CssChunk";

describe(`CssChunk`, () => {
  it(`declares extension list`, () => {
    expect(CssChunk.extensions).toStrictEqual([`.css`]);
  });

  it(`extracts top-level css nodes`, () => {
    expect(CssChunk.build({ path: `style.css`, source: `.a { color: red; }\n@media screen { .b { color: blue; } }` }))
      .toMatchInlineSnapshot(`
        [
          {
            "endLine": 1,
            "path": "style.css",
            "startLine": 1,
            "text": ".a { color: red; }",
          },
          {
            "endLine": 2,
            "path": "style.css",
            "startLine": 2,
            "text": ".b { color: blue; }",
          },
        ]
      `);
  });

  it(`returns empty list for empty css`, () => {
    expect(CssChunk.build({ path: `empty.css`, source: `` })).toMatchInlineSnapshot(`[]`);
  });

  it(`ignores declarations without rules`, () => {
    expect(CssChunk.build({ path: `vars.css`, source: `--gap: 8px;` })).toMatchInlineSnapshot(`[]`);
  });
});
