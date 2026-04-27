import { describe, expect, it } from "vitest";

import { TsChunk } from "./TsChunk";

describe(`TsChunk`, () => {
  it(`declares extension list`, () => {
    expect(TsChunk.extensions).toStrictEqual([`.ts`]);
  });

  it(`extracts top-level typescript declarations`, () => {
    expect(
      TsChunk.build({ path: `types.ts`, source: `interface A { a: number }\nfunction run(): number { return 1; }` }),
    ).toMatchInlineSnapshot(`
      [
        {
          "endLine": 1,
          "path": "types.ts",
          "startLine": 1,
          "text": "interface A { a: number }",
        },
        {
          "endLine": 2,
          "path": "types.ts",
          "startLine": 2,
          "text": "function run(): number { return 1; }",
        },
      ]
    `);
  });

  it(`returns empty list for empty typescript source`, () => {
    expect(TsChunk.build({ path: `empty.ts`, source: `` })).toMatchInlineSnapshot(`[]`);
  });

  it(`extracts type alias and class declarations`, () => {
    expect(TsChunk.build({ path: `model.ts`, source: `type Id = string;\nclass User { id: Id = "x"; }` }))
      .toMatchInlineSnapshot(`
        [
          {
            "endLine": 1,
            "path": "model.ts",
            "startLine": 1,
            "text": "type Id = string;",
          },
          {
            "endLine": 2,
            "path": "model.ts",
            "startLine": 2,
            "text": "class User { id: Id = "x"; }",
          },
        ]
      `);
  });

  it(`extracts top-level export statements`, () => {
    expect(TsChunk.build({ path: `index.ts`, source: `export * from "./a";\nexport * from "./b";` }))
      .toMatchInlineSnapshot(`
        [
          {
            "endLine": 1,
            "path": "index.ts",
            "startLine": 1,
            "text": "export * from "./a";",
          },
          {
            "endLine": 2,
            "path": "index.ts",
            "startLine": 2,
            "text": "export * from "./b";",
          },
        ]
      `);
  });

  it(`extracts top-level imports and exported declarations`, () => {
    expect(
      TsChunk.build({
        path: `api.ts`,
        source: `import type { User } from "./types";\nexport const run = (user: User) => user.id;`,
      }),
    ).toMatchInlineSnapshot(`
      [
        {
          "endLine": 1,
          "path": "api.ts",
          "startLine": 1,
          "text": "import type { User } from "./types";",
        },
        {
          "endLine": 2,
          "path": "api.ts",
          "startLine": 2,
          "text": "export const run = (user: User) => user.id;",
        },
      ]
    `);
  });

  it(`extracts enums namespaces and module declarations`, () => {
    expect(
      TsChunk.build({
        path: `shapes.ts`,
        source: `enum Kind { A = "a" }\nnamespace Api { export type Id = string; }\ndeclare module "x" { export const ok: true; }`,
      }),
    ).toMatchInlineSnapshot(`
      [
        {
          "endLine": 1,
          "path": "shapes.ts",
          "startLine": 1,
          "text": "enum Kind { A = "a" }",
        },
        {
          "endLine": 2,
          "path": "shapes.ts",
          "startLine": 2,
          "text": "export type Id = string;",
        },
        {
          "endLine": 3,
          "path": "shapes.ts",
          "startLine": 3,
          "text": "module "x" { export const ok: true; }",
        },
      ]
    `);
  });
});
