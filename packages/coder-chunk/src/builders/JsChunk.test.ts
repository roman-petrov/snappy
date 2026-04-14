import { describe, expect, it } from "vitest";

import { JsChunk } from "./JsChunk";

describe(`JsChunk`, () => {
  it(`declares extension list`, () => {
    expect(JsChunk.extensions).toStrictEqual([`.js`]);
  });

  it(`extracts top-level javascript declarations`, () => {
    expect(JsChunk.build({ path: `app.js`, source: `function one() { return 1; }\nconst two = () => 2;` }))
      .toMatchInlineSnapshot(`
        [
          {
            "endLine": 1,
            "path": "app.js",
            "startLine": 1,
            "text": "function one() { return 1; }",
          },
          {
            "endLine": 2,
            "path": "app.js",
            "startLine": 2,
            "text": "const two = () => 2;",
          },
        ]
      `);
  });

  it(`returns empty list for empty javascript source`, () => {
    expect(JsChunk.build({ path: `empty.js`, source: `` })).toMatchInlineSnapshot(`[]`);
  });

  it(`extracts top-level class but not nested methods`, () => {
    expect(JsChunk.build({ path: `class.js`, source: `class A { one() { return 1; } two() { return 2; } }` }))
      .toMatchInlineSnapshot(`
        [
          {
            "endLine": 1,
            "path": "class.js",
            "startLine": 1,
            "text": "class A { one() { return 1; } two() { return 2; } }",
          },
        ]
      `);
  });
});
