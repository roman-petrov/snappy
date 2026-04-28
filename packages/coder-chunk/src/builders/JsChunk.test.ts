import { describe, expect, it } from "vitest";

import { JsChunk } from "./JsChunk";

const { build, extensions } = JsChunk;

describe(`JsChunk`, () => {
  it(`declares extension list`, () => {
    expect(extensions).toStrictEqual([`.js`]);
  });

  describe(`build`, () => {
    it(`returns empty list for empty source`, () => {
      expect(build({ path: `empty.js`, source: `` })).toMatchInlineSnapshot(`[]`);
    });

    it(`extracts top-level function and lexical declaration`, () => {
      expect(build({ path: `app.js`, source: `function one() { return 1; }\nconst two = () => 2;` }))
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

    it(`extracts import and export statements`, () => {
      expect(build({ path: `index.js`, source: `import { a } from "./a";\nexport { a };` })).toMatchInlineSnapshot(`
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

    it(`extracts barrel exports as separate chunks`, () => {
      expect(build({ path: `index.js`, source: `export * from "./a";\nexport * from "./b";` })).toMatchInlineSnapshot(`
        [
          {
            "endLine": 1,
            "path": "index.js",
            "startLine": 1,
            "text": "export * from "./a";",
          },
          {
            "endLine": 2,
            "path": "index.js",
            "startLine": 2,
            "text": "export * from "./b";",
          },
        ]
      `);
    });

    it(`extracts non-exported const arrow as lexical declaration`, () => {
      expect(build({ path: `local.js`, source: `const run = value => value + 1;` })).toMatchInlineSnapshot(`
        [
          {
            "endLine": 1,
            "path": "local.js",
            "startLine": 1,
            "text": "const run = value => value + 1;",
          },
        ]
      `);
    });

    it(`extracts exported const arrow as export statement`, () => {
      expect(build({ path: `api.js`, source: `export const run = value => value + 1;` })).toMatchInlineSnapshot(`
        [
          {
            "endLine": 1,
            "path": "api.js",
            "startLine": 1,
            "text": "export const run = value => value + 1;",
          },
        ]
      `);
    });

    it(`extracts const function expression as lexical declaration`, () => {
      expect(build({ path: `fn.js`, source: `const run = function (value) { return value + 1; };` }))
        .toMatchInlineSnapshot(`
          [
            {
              "endLine": 1,
              "path": "fn.js",
              "startLine": 1,
              "text": "const run = function (value) { return value + 1; };",
            },
          ]
        `);
    });

    it(`keeps class as one chunk and skips nested methods`, () => {
      expect(build({ path: `class.js`, source: `class A {\n  one() { return 1; }\n  two() { return 2; }\n}` }))
        .toMatchInlineSnapshot(`
          [
            {
              "endLine": 4,
              "path": "class.js",
              "startLine": 1,
              "text": "class A {
            one() { return 1; }
            two() { return 2; }
          }",
            },
          ]
        `);
    });

    it(`extracts export default class declaration`, () => {
      expect(build({ path: `default.js`, source: `export default class Service { run() { return 1; } }` }))
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
        build({
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
});
