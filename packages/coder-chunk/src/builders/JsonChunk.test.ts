import { describe, expect, it } from "vitest";

import { JsonChunk } from "./JsonChunk";

describe(`JsonChunk`, () => {
  it(`declares extension list`, () => {
    expect(JsonChunk.extensions).toStrictEqual([`.json`]);
  });

  it(`extracts top-level json structures`, () => {
    expect(JsonChunk.build({ path: `data.json`, source: `{"a":1,"b":{"c":2}}` })).toMatchInlineSnapshot(`
      [
        {
          "endLine": 1,
          "path": "data.json",
          "startLine": 1,
          "text": "{"a":1,"b":{"c":2}}",
        },
      ]
    `);
  });

  it(`returns empty list for empty json source`, () => {
    expect(JsonChunk.build({ path: `empty.json`, source: `` })).toMatchInlineSnapshot(`[]`);
  });

  it(`extracts top-level array`, () => {
    expect(JsonChunk.build({ path: `list.json`, source: `[1, {"a":2}]` })).toMatchInlineSnapshot(`
      [
        {
          "endLine": 1,
          "path": "list.json",
          "startLine": 1,
          "text": "[1, {"a":2}]",
        },
      ]
    `);
  });
});
