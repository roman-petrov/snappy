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

  it(`extracts rules nested inside media and supports`, () => {
    expect(
      CssChunk.build({
        path: `nested.css`,
        source: `@media screen { .a { color: red; } }\n@supports (display: grid) { .b { display: grid; } }`,
      }),
    ).toMatchInlineSnapshot(`
      [
        {
          "endLine": 1,
          "path": "nested.css",
          "startLine": 1,
          "text": ".a { color: red; }",
        },
        {
          "endLine": 2,
          "path": "nested.css",
          "startLine": 2,
          "text": ".b { display: grid; }",
        },
      ]
    `);
  });

  it(`extracts root custom-properties in rule sets`, () => {
    expect(CssChunk.build({ path: `anim.css`, source: `:root { --gap: 8px; --radius: 12px; }` }))
      .toMatchInlineSnapshot(`
        [
          {
            "endLine": 1,
            "path": "anim.css",
            "startLine": 1,
            "text": ":root { --gap: 8px; --radius: 12px; }",
          },
        ]
      `);
  });
});
