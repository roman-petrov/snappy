import { describe, expect, it } from "vitest";

import { TsxChunk } from "./TsxChunk";

describe(`TsxChunk`, () => {
  it(`declares extension list`, () => {
    expect(TsxChunk.extensions).toStrictEqual([`.tsx`]);
  });

  it(`extracts top-level tsx declarations`, () => {
    expect(TsxChunk.build({ path: `view.tsx`, source: `type Id = string;\nconst el = <main>ok</main>;` }))
      .toMatchInlineSnapshot(`
        [
          {
            "endLine": 1,
            "path": "view.tsx",
            "startLine": 1,
            "text": "type Id = string;",
          },
          {
            "endLine": 2,
            "path": "view.tsx",
            "startLine": 2,
            "text": "<main>ok</main>",
          },
        ]
      `);
  });

  it(`returns empty list for empty tsx source`, () => {
    expect(TsxChunk.build({ path: `empty.tsx`, source: `` })).toMatchInlineSnapshot(`[]`);
  });

  it(`extracts interface and jsx element inside assignment`, () => {
    expect(
      TsxChunk.build({ path: `props.tsx`, source: `interface Props { id: string }\nconst el = <div id="a">x</div>;` }),
    ).toMatchInlineSnapshot(`
      [
        {
          "endLine": 1,
          "path": "props.tsx",
          "startLine": 1,
          "text": "interface Props { id: string }",
        },
        {
          "endLine": 2,
          "path": "props.tsx",
          "startLine": 2,
          "text": "<div id="a">x</div>",
        },
      ]
    `);
  });

  it(`extracts imports and exported components`, () => {
    expect(
      TsxChunk.build({
        path: `component.tsx`,
        source: `import { useMemo } from "react";\nexport function View() { return <main>{useMemo(() => "ok", [])}</main>; }`,
      }),
    ).toMatchInlineSnapshot(`
      [
        {
          "endLine": 1,
          "path": "component.tsx",
          "startLine": 1,
          "text": "import { useMemo } from "react";",
        },
        {
          "endLine": 2,
          "path": "component.tsx",
          "startLine": 2,
          "text": "export function View() { return <main>{useMemo(() => "ok", [])}</main>; }",
        },
      ]
    `);
  });

  it(`extracts generic function and exported arrow component`, () => {
    expect(
      TsxChunk.build({
        path: `generic.tsx`,
        source: `function pick<T>(value: T): T { return value; }\nexport const Item = () => <article>{pick("ok")}</article>;`,
      }),
    ).toMatchInlineSnapshot(`
      [
        {
          "endLine": 1,
          "path": "generic.tsx",
          "startLine": 1,
          "text": "function pick<T>(value: T): T { return value; }",
        },
        {
          "endLine": 2,
          "path": "generic.tsx",
          "startLine": 2,
          "text": "export const Item = () => <article>{pick("ok")}</article>;",
        },
      ]
    `);
  });
});
