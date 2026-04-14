import { describe, expect, it } from "vitest";

import { JavaChunk } from "./JavaChunk";

describe(`JavaChunk`, () => {
  it(`declares extension list`, () => {
    expect(JavaChunk.extensions).toStrictEqual([`.java`]);
  });

  it(`extracts top-level java declarations`, () => {
    expect(JavaChunk.build({ path: `Main.java`, source: `class Main { int sum() { return 1; } }\ninterface Port {}` }))
      .toMatchInlineSnapshot(`
        [
          {
            "endLine": 1,
            "path": "Main.java",
            "startLine": 1,
            "text": "class Main { int sum() { return 1; } }",
          },
          {
            "endLine": 2,
            "path": "Main.java",
            "startLine": 2,
            "text": "interface Port {}",
          },
        ]
      `);
  });

  it(`returns empty list for empty java source`, () => {
    expect(JavaChunk.build({ path: `Empty.java`, source: `` })).toMatchInlineSnapshot(`[]`);
  });

  it(`does not duplicate nested methods from class body`, () => {
    expect(
      JavaChunk.build({
        path: `OnlyClass.java`,
        source: `class Main { int sum() { return 1; } int sub() { return 0; } }`,
      }),
    ).toMatchInlineSnapshot(`
      [
        {
          "endLine": 1,
          "path": "OnlyClass.java",
          "startLine": 1,
          "text": "class Main { int sum() { return 1; } int sub() { return 0; } }",
        },
      ]
    `);
  });
});
