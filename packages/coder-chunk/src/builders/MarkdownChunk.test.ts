import { describe, expect, it } from "vitest";

import { MarkdownChunk } from "./MarkdownChunk";

describe(`MarkdownChunk`, () => {
  it(`declares extension list`, () => {
    expect(MarkdownChunk.extensions).toStrictEqual([`.md`, `.mdc`]);
  });

  it(`splits markdown by headings`, () => {
    expect(MarkdownChunk.build({ path: `doc.md`, source: `# Intro\nalpha\n## Details\nbeta` })).toMatchInlineSnapshot(`
      [
        {
          "endLine": 2,
          "path": "doc.md",
          "startLine": 1,
          "text": "# Intro
      alpha",
        },
        {
          "endLine": 4,
          "path": "doc.md",
          "startLine": 3,
          "text": "## Details
      beta",
        },
      ]
    `);
  });

  it(`returns empty list when there are no headings`, () => {
    expect(MarkdownChunk.build({ path: `plain.md`, source: `alpha\nbeta` })).toMatchInlineSnapshot(`[]`);
  });

  it(`supports indented headings and keeps body`, () => {
    expect(MarkdownChunk.build({ path: `indented.md`, source: `   ## Title\ntext\n### Next\nmore` }))
      .toMatchInlineSnapshot(`
        [
          {
            "endLine": 2,
            "path": "indented.md",
            "startLine": 1,
            "text": "   ## Title
        text",
          },
          {
            "endLine": 4,
            "path": "indented.md",
            "startLine": 3,
            "text": "### Next
        more",
          },
        ]
      `);
  });
});
