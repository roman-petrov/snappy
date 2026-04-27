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

  it(`extracts top-level import and export statements`, () => {
    expect(JsChunk.build({ path: `index.js`, source: `import { a } from "./a";\nexport { a };` }))
      .toMatchInlineSnapshot(`
        [
          {
            "endLine": 1,
            "path": "index.js",
            "startLine": 1,
            "text": "import { a } from "./a";",
          },
          {
            "endLine": 2,
            "path": "index.js",
            "startLine": 2,
            "text": "export { a };",
          },
        ]
      `);
  });

  it(`extracts export default declarations`, () => {
    expect(JsChunk.build({ path: `default.js`, source: `export default class Service { run() { return 1; } }` }))
      .toMatchInlineSnapshot(`
        [
          {
            "endLine": 1,
            "path": "default.js",
            "startLine": 1,
            "text": "export default class Service { run() { return 1; } }",
          },
        ]
      `);
  });

  it(`extracts generator and exported async function`, () => {
    expect(
      JsChunk.build({
        path: `flow.js`,
        source: `function* ids() { yield 1; }\nexport async function load() { return await Promise.resolve(1); }`,
      }),
    ).toMatchInlineSnapshot(`
      [
        {
          "endLine": 1,
          "path": "flow.js",
          "startLine": 1,
          "text": "function* ids() { yield 1; }",
        },
        {
          "endLine": 2,
          "path": "flow.js",
          "startLine": 2,
          "text": "export async function load() { return await Promise.resolve(1); }",
        },
      ]
    `);
  });
});
