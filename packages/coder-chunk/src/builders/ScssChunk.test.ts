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
          "endLine": 1,
          "path": "style.scss",
          "startLine": 1,
          "text": "$c: red;",
        },
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

  it(`extracts chunks for scss use directives`, () => {
    expect(ScssChunk.build({ path: `styles.scss`, source: `@use "pkg:@snappy/theme/styles" as *;` }))
      .toMatchInlineSnapshot(`
        [
          {
            "endLine": 1,
            "path": "styles.scss",
            "startLine": 1,
            "text": "@use "pkg:@snappy/theme/styles" as *;",
          },
        ]
      `);
  });

  it(`extracts chunks for top-level scss variables`, () => {
    expect(ScssChunk.build({ path: `layout.scss`, source: `$feature-grid-min-track: 18.75rem;` }))
      .toMatchInlineSnapshot(`
        [
          {
            "endLine": 1,
            "path": "layout.scss",
            "startLine": 1,
            "text": "$feature-grid-min-track: 18.75rem;",
          },
        ]
      `);
  });

  it(`extracts nested rule sets inside media at-rules`, () => {
    expect(
      ScssChunk.build({ path: `responsive.scss`, source: `@media (min-width: 60rem) { .card { padding: 1rem; } }` }),
    ).toMatchInlineSnapshot(`
      [
        {
          "endLine": 1,
          "path": "responsive.scss",
          "startLine": 1,
          "text": ".card { padding: 1rem; }",
        },
      ]
    `);
  });

  it(`extracts multiple use directives and a nested rule`, () => {
    expect(
      ScssChunk.build({
        path: `theme.scss`,
        source: `@use "pkg:@snappy/theme/color";\n@use "pkg:@snappy/theme/tokens";\n.button { color: color-mix(in srgb, red 50%, blue); }`,
      }),
    ).toMatchInlineSnapshot(`
      [
        {
          "endLine": 2,
          "path": "theme.scss",
          "startLine": 1,
          "text": "@use "pkg:@snappy/theme/color";
      @use",
        },
        {
          "endLine": 3,
          "path": "theme.scss",
          "startLine": 2,
          "text": ""pkg:@snappy/theme/tokens";
      .button { color: color-mix(in srgb, red 50%, blue); }",
        },
      ]
    `);
  });
});
