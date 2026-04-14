import { describe, expect, it } from "vitest";

import { GenericChunk } from "./GenericChunk";

describe(`GenericChunk`, () => {
  it(`splits plain text into line chunks`, () => {
    expect(GenericChunk({ path: `note.txt`, source: `line 1\nline 2\nline 3` })).toMatchInlineSnapshot(`
      [
        {
          "endLine": 3,
          "path": "note.txt",
          "startLine": 1,
          "text": "line 1
      line 2
      line 3",
        },
      ]
    `);
  });

  it(`returns one chunk for empty source`, () => {
    expect(GenericChunk({ path: `empty.txt`, source: `` })).toMatchInlineSnapshot(`
      [
        {
          "endLine": 1,
          "path": "empty.txt",
          "startLine": 1,
          "text": "",
        },
      ]
    `);
  });

  it(`keeps single line as one chunk`, () => {
    expect(GenericChunk({ path: `long.txt`, source: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` })).toMatchInlineSnapshot(`
      [
        {
          "endLine": 1,
          "path": "long.txt",
          "startLine": 1,
          "text": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        },
      ]
    `);
  });
});
