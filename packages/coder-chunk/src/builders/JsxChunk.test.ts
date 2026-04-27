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
          "text": "export function View() { return <main><span>ok</span></main>; }",
        },
      ]
    `);
  });

  it(`extracts imports and default exported jsx component`, () => {
    expect(
      JsxChunk.build({
        path: `page.jsx`,
        source: `import { useState } from "react";\nexport default function Page() { const [open] = useState(true); return <section>{open ? "yes" : "no"}</section>; }`,
      }),
    ).toMatchInlineSnapshot(`
      [
        {
          "endLine": 1,
          "path": "page.jsx",
          "startLine": 1,
          "text": "import { useState } from "react";",
        },
        {
          "endLine": 2,
          "path": "page.jsx",
          "startLine": 2,
          "text": "export default function Page() { const [open] = useState(true); return <section>{open ? "yes" : "no"}</section>; }",
        },
      ]
    `);
  });

  it(`extracts exported arrow components with fragments`, () => {
    expect(JsxChunk.build({ path: `list.jsx`, source: `export const List = () => <><li>a</li><li>b</li></>;` }))
      .toMatchInlineSnapshot(`
        [
          {
            "endLine": 1,
            "path": "list.jsx",
            "startLine": 1,
            "text": "export const List = () => <><li>a</li><li>b</li></>;",
          },
        ]
      `);
  });
});
