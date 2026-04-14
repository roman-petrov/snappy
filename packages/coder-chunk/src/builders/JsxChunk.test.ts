import { describe, expect, it } from "vitest";

import { JsxChunk } from "./JsxChunk";

describe(`JsxChunk`, () => {
  it(`declares extension list`, () => {
    expect(JsxChunk.extensions).toStrictEqual([`.jsx`]);
  });

  it(`extracts jsx elements and declarations`, () => {
    expect(
      JsxChunk.build({
        path: `view.jsx`,
        source: `function View() { return <section>ok</section>; }\n<div>standalone</div>;`,
      }),
    ).toMatchInlineSnapshot(`
      [
        {
          "endLine": 1,
          "path": "view.jsx",
          "startLine": 1,
          "text": "function View() { return <section>ok</section>; }",
        },
        {
          "endLine": 2,
          "path": "view.jsx",
          "startLine": 2,
          "text": "<div>standalone</div>",
        },
      ]
    `);
  });

  it(`returns empty list for empty jsx source`, () => {
    expect(JsxChunk.build({ path: `empty.jsx`, source: `` })).toMatchInlineSnapshot(`[]`);
  });

  it(`extracts function component as top-level node`, () => {
    expect(
      JsxChunk.build({
        path: `component.jsx`,
        source: `export function View() { return <main><span>ok</span></main>; }`,
      }),
    ).toMatchInlineSnapshot(`
      [
        {
          "endLine": 1,
          "path": "component.jsx",
          "startLine": 1,
          "text": "function View() { return <main><span>ok</span></main>; }",
        },
      ]
    `);
  });
});
