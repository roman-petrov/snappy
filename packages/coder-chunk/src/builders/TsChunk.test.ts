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
});
