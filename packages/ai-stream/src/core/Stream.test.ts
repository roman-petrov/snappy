// cspell:disable
import { describe, expect, it } from "vitest";

import type { Piece } from "./Types";

import { type AnnotatedList, type AnnotatedTable, Stream } from "./Stream";

const { annotate, apply, segments, tailHtml } = Stream;

describe(`apply`, () => {
  it(`returns empty array unchanged`, () => {
    expect(apply([])).toMatchInlineSnapshot(`[]`);
  });

  it(`opens single top-level code`, () => {
    expect(apply([{ closed: true, html: ``, lang: `js`, source: `x`, type: `code` }])).toMatchInlineSnapshot(`
      [
        {
          "closed": false,
          "html": "",
          "lang": "js",
          "source": "x",
          "type": "code",
        },
      ]
    `);
  });

  it(`opens last top-level code block`, () => {
    expect(
      apply([
        { closed: true, html: ``, lang: `js`, source: `a();`, type: `code` },
        { closed: true, html: ``, lang: `ts`, source: `const x = 1`, type: `code` },
      ]),
    ).toMatchInlineSnapshot(`
      [
        {
          "closed": true,
          "html": "",
          "lang": "js",
          "source": "a();",
          "type": "code",
        },
        {
          "closed": false,
          "html": "",
          "lang": "ts",
          "source": "const x = 1",
          "type": "code",
        },
      ]
    `);
  });

  it(`does not open nested code in list`, () => {
    expect(
      apply([
        {
          html: ``,
          items: [{ body: [{ closed: true, html: ``, lang: `ts`, source: `const x = 1`, type: `code` }] }],
          kind: `unordered`,
          type: `list`,
        },
        { closed: true, html: ``, lang: `js`, source: `a();`, type: `code` },
      ]),
    ).toMatchInlineSnapshot(`
      [
        {
          "html": "",
          "items": [
            {
              "body": [
                {
                  "closed": true,
                  "html": "",
                  "lang": "ts",
                  "source": "const x = 1",
                  "type": "code",
                },
              ],
            },
          ],
          "kind": "unordered",
          "type": "list",
        },
        {
          "closed": false,
          "html": "",
          "lang": "js",
          "source": "a();",
          "type": "code",
        },
      ]
    `);
  });

  it(`does not mutate input`, () => {
    const input: Piece[] = [{ closed: true, html: ``, lang: `js`, source: `x`, type: `code` }];
    const before = structuredClone(input);

    apply(input);

    expect(input).toStrictEqual(before);
  });
});

describe(`segments`, () => {
  it(`returns empty for empty pieces`, () => {
    expect(segments([])).toStrictEqual([]);
  });

  it(`merges consecutive top-level html`, () => {
    expect(
      segments([
        { html: `<p>a</p>`, type: `html` },
        { html: `<p>b</p>`, type: `html` },
      ]),
    ).toStrictEqual([{ html: `<p>a</p><p>b</p>`, kind: `html` }]);
  });

  it(`splits top-level html and code`, () => {
    expect(
      segments([
        { closed: true, html: ``, lang: `js`, source: `a();`, type: `code` },
        { html: `<p>after</p>`, type: `html` },
      ]),
    ).toStrictEqual([
      { html: ``, kind: `code`, lang: `js`, source: `a();` },
      { html: `<p>after</p>`, kind: `html` },
    ]);
  });

  it(`emits one segment per list item`, () => {
    expect(
      segments([
        {
          html: `<ul><li>A</li><li>B</li></ul>`,
          items: [{ body: [{ html: `A`, type: `html` }] }, { body: [{ html: `B`, type: `html` }] }],
          kind: `unordered`,
          type: `list`,
        },
      ]),
    ).toStrictEqual([
      { html: `A`, kind: `html` },
      { html: `B`, kind: `html` },
    ]);
  });

  it(`merges multiple html pieces in one list item body`, () => {
    expect(
      segments([
        {
          html: ``,
          items: [
            {
              body: [
                { html: `<p>one</p>`, type: `html` },
                { html: `<p>two</p>`, type: `html` },
              ],
            },
          ],
          kind: `unordered`,
          type: `list`,
        },
      ]),
    ).toStrictEqual([{ html: `<p>one</p><p>two</p>`, kind: `html` }]);
  });

  it(`emits nested list items after parent body`, () => {
    expect(
      segments([
        {
          html: `<ul><li>One<ul><li><strong>nested</strong></li></ul></li></ul>`,
          items: [
            {
              body: [{ html: `One`, type: `html` }],
              children: {
                html: `<ul><li><strong>nested</strong></li></ul>`,
                items: [{ body: [{ html: `<strong>nested</strong>`, type: `html` }] }],
                kind: `unordered`,
                type: `list`,
              },
            },
          ],
          kind: `unordered`,
          type: `list`,
        },
      ]),
    ).toStrictEqual([
      { html: `One`, kind: `html` },
      { html: `<strong>nested</strong>`, kind: `html` },
    ]);
  });

  it(`emits one segment per table cell`, () => {
    expect(
      segments([
        {
          html: `<table></table>`,
          rows: [
            [[{ html: `<p>Name</p>`, type: `html` }], [{ html: `<p>Value</p>`, type: `html` }]],
            [[{ html: `<p>Alpha</p>`, type: `html` }], [{ html: `<p>2</p>`, type: `html` }]],
          ],
          type: `table`,
        },
      ]),
    ).toStrictEqual([
      { html: `<p>Name</p>`, kind: `html` },
      { html: `<p>Value</p>`, kind: `html` },
      { html: `<p>Alpha</p>`, kind: `html` },
      { html: `<p>2</p>`, kind: `html` },
    ]);
  });

  it(`emits code segment in table cell`, () => {
    expect(
      segments([
        {
          html: `<table></table>`,
          rows: [[[{ closed: true, html: ``, lang: `ts`, source: `x`, type: `code` }]]],
          type: `table`,
        },
      ]),
    ).toStrictEqual([{ html: ``, kind: `code`, lang: `ts`, source: `x` }]);
  });

  it(`orders list then trailing top-level html`, () => {
    expect(
      segments([
        {
          html: `<ul><li>item</li></ul>`,
          items: [{ body: [{ html: `item`, type: `html` }] }],
          kind: `unordered`,
          type: `list`,
        },
        { html: `<p>tail</p>`, type: `html` },
      ]),
    ).toStrictEqual([
      { html: `item`, kind: `html` },
      { html: `<p>tail</p>`, kind: `html` },
    ]);
  });
});

describe(`annotate`, () => {
  it(`matches segments for nested list`, () => {
    const pieces: Piece[] = [
      {
        html: `<ul><li>One<ul><li>nested</li></ul></li></ul>`,
        items: [
          {
            body: [{ html: `One`, type: `html` }],
            children: {
              html: `<ul><li>nested</li></ul>`,
              items: [{ body: [{ html: `nested`, type: `html` }] }],
              kind: `unordered`,
              type: `list`,
            },
          },
        ],
        kind: `unordered`,
        type: `list`,
      },
    ];

    const { doc, segments: flat } = annotate(pieces);

    expect(flat).toStrictEqual(segments(pieces));

    const listTop = doc.find(
      (piece): piece is { list: AnnotatedList; type: `list` } => `type` in piece && piece.type === `list`,
    );

    expect(listTop).toBeDefined();
    expect(listTop?.list.firstIndex).toBe(0);
    expect(listTop?.list.items[0]?.firstIndex).toBe(0);
    expect(listTop?.list.items[0]?.body[0]?.index).toBe(0);
    expect(listTop?.list.items[0]?.children?.firstIndex).toBe(1);
    expect(listTop?.list.items[0]?.children?.items[0]?.firstIndex).toBe(1);
  });

  it(`assigns firstIndex per table cell in row-major order`, () => {
    const pieces: Piece[] = [
      {
        html: `<table></table>`,
        rows: [[[{ html: `a`, type: `html` }], [{ html: `b`, type: `html` }]], [[{ html: `c`, type: `html` }]]],
        type: `table`,
      },
    ];

    const { doc } = annotate(pieces);

    const tableTop = doc.find(
      (piece): piece is { table: AnnotatedTable; type: `table` } => `type` in piece && piece.type === `table`,
    );

    expect(tableTop).toBeDefined();
    expect(tableTop?.table.firstIndex).toBe(0);
    expect(tableTop?.table.rows[0]?.[0]?.firstIndex).toBe(0);
    expect(tableTop?.table.rows[0]?.[1]?.firstIndex).toBe(1);
    expect(tableTop?.table.rows[1]?.[0]?.firstIndex).toBe(2);
  });
});

describe(`tailHtml`, () => {
  const pieces: Piece[] = [
    { html: `<p>intro</p>`, type: `html` },
    {
      html: `<ul><li>x</li></ul>`,
      items: [{ body: [{ html: `<p>streaming</p>`, type: `html` }] }],
      kind: `unordered`,
      type: `list`,
    },
  ];

  it(`returns html for segment`, () => {
    expect(tailHtml({ html: `<p>streaming</p>`, kind: `html` }, ``)).toBe(`<p>streaming</p>`);
  });

  it(`returns shiki html for code segment when provided`, () => {
    expect(tailHtml({ html: ``, kind: `code`, lang: `ts`, source: `x` }, `<pre>x</pre>`)).toBe(`<pre>x</pre>`);
  });

  it(`uses last list item segment from pieces`, () => {
    const list = segments(pieces);

    expect(tailHtml(list.at(-1), ``)).toBe(`<p>streaming</p>`);
  });
});
