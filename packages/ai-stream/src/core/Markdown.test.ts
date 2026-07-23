import { describe, expect, it } from "vitest";

import { Markdown } from "./Markdown";
import { Stream } from "./Stream";

const { html, pieces } = Markdown;
const { apply, fenceOpen } = Stream;
const openFence = (body: string) => `\`\`\`js\n${body}`;
const closedFence = (body: string) => `\`\`\`js\n${body}\n\`\`\``;

const shape = (source: string) =>
  pieces(source).map(piece => {
    if (piece.type === `code`) {
      return { closed: piece.closed, lang: piece.lang, source: piece.source, type: piece.type };
    }
    if (piece.type === `list`) {
      return {
        items: piece.items.map(item => ({
          body: item.body.map(entry => entry.type),
          nested: item.children !== undefined,
        })),
        kind: piece.kind,
        type: piece.type,
      };
    }
    if (piece.type === `table`) {
      return { cols: piece.rows[0]?.length ?? 0, rows: piece.rows.length, type: piece.type };
    }

    return { type: piece.type };
  });

describe(`pieces`, () => {
  it(`parses a paragraph with inline emphasis`, () => {
    expect(shape(`Hello **world**`)).toMatchInlineSnapshot(`
      [
        {
          "type": "html",
        },
      ]
    `);
    expect(html(`Hello **world**`)).toContain(`<strong>world</strong>`);
  });

  it(`keeps an open fence open when streaming`, () => {
    const source = openFence(`const x = 42;`);
    const parsed = pieces(source);

    expect(fenceOpen(source)).toBe(true);
    expect(shape(source)).toMatchInlineSnapshot(`
      [
        {
          "closed": true,
          "lang": "js",
          "source": "const x = 42;",
          "type": "code",
        },
      ]
    `);

    const opened = apply(parsed, fenceOpen(source));

    expect(opened).toHaveLength(1);
    expect(opened[0]).toMatchObject({ closed: false, lang: `js`, source: `const x = 42;`, type: `code` });
  });

  it(`repairs an incomplete gfm table into a table piece`, () => {
    expect(shape(`| Name | Value |\n| --- | --- |\n| alpha |`)).toMatchInlineSnapshot(`
      [
        {
          "cols": 2,
          "rows": 2,
          "type": "table",
        },
      ]
    `);
  });

  it(`parses a nested list`, () => {
    expect(
      shape(`- parent
  - child`),
    ).toMatchInlineSnapshot(`
      [
        {
          "items": [
            {
              "body": [
                "html",
              ],
              "nested": true,
            },
          ],
          "kind": "unordered",
          "type": "list",
        },
      ]
    `);
  });

  it(`parses a closed code block followed by trailing text`, () => {
    expect(shape(`${closedFence(`const a = 1;`)}\n\nfinal words`)).toMatchInlineSnapshot(`
      [
        {
          "closed": true,
          "lang": "js",
          "source": "const a = 1;",
          "type": "code",
        },
        {
          "type": "html",
        },
      ]
    `);
  });
});

describe(`html`, () => {
  it(`renders markdown to html string`, () => {
    expect(html(`# Title`)).toContain(`<h1`);
  });
});
