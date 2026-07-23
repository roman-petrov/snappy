// cspell:disable
import { describe, expect, it } from "vitest";

import type { Piece } from "./Types";

import { type AnnotatedList, type AnnotatedTable, Stream } from "./Stream";

const { annotate, apply, fenceOpen, sealCount, segmentMode, segments, showNode, tailHtml, topFirstIndex } = Stream;

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

  it(`keeps last code closed when openLastCode is false`, () => {
    expect(apply([{ closed: true, html: ``, lang: `js`, source: `x`, type: `code` }], false)).toMatchInlineSnapshot(`
      [
        {
          "closed": true,
          "html": "",
          "lang": "js",
          "source": "x",
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

describe(`fenceOpen`, () => {
  it(`detects unclosed fence`, () => {
    expect(fenceOpen(`\`\`\`js\nx`)).toBe(true);
    expect(fenceOpen(`\`\`\`js\nx\n\`\`\``)).toBe(false);
  });

  it(`ignores inline triple backticks inside a closed fence`, () => {
    expect(fenceOpen(`\`\`\`js\ncode with \`\`\` inside\n\`\`\``)).toBe(false);
  });

  it(`treats matching tilde fences like backtick fences`, () => {
    expect(fenceOpen(`~~~\nbody`)).toBe(true);
    expect(fenceOpen(`~~~\nbody\n~~~`)).toBe(false);
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

describe(`sealCount`, () => {
  it(`keeps the active top piece live`, () => {
    const { doc } = annotate([
      { html: `<p>one</p>`, type: `html` },
      { html: `<p>two</p>`, type: `html` },
    ]);

    expect(sealCount(doc, 0)).toBe(0);
    expect(sealCount(doc, 1)).toBe(1);
  });

  it(`does not seal a multi-segment top piece until fully behind playIndex`, () => {
    const { doc } = annotate([
      {
        html: `<ul></ul>`,
        items: [{ body: [{ html: `a`, type: `html` }] }, { body: [{ html: `b`, type: `html` }] }],
        kind: `unordered`,
        type: `list`,
      },
      { html: `<p>tail</p>`, type: `html` },
    ]);

    expect(sealCount(doc, 1)).toBe(0);
    expect(sealCount(doc, 2)).toBe(1);
  });
});

describe(`segmentMode`, () => {
  it(`marks done, tail, and pending while streaming`, () => {
    expect(segmentMode(0, 1, true)).toBe(`done`);
    expect(segmentMode(1, 1, true)).toBe(`tail`);
    expect(segmentMode(2, 1, true)).toBe(`pending`);
  });

  it(`marks every index done when not streaming`, () => {
    expect(segmentMode(0, 0, false)).toBe(`done`);
    expect(segmentMode(42, 0, false)).toBe(`done`);
  });
});

describe(`showNode`, () => {
  it(`hides nodes ahead of playIndex while streaming`, () => {
    expect(showNode(0, 1, true)).toBe(true);
    expect(showNode(1, 1, true)).toBe(true);
    expect(showNode(2, 1, true)).toBe(false);
  });

  it(`shows every node when not streaming`, () => {
    expect(showNode(42, 0, false)).toBe(true);
  });
});

describe(`topFirstIndex`, () => {
  it(`reads index from html, list, and table tops`, () => {
    const { doc } = annotate([
      { html: `<p>one</p>`, type: `html` },
      { html: `<ul></ul>`, items: [{ body: [{ html: `a`, type: `html` }] }], kind: `unordered`, type: `list` },
      {
        html: `<table></table>`,
        rows: [[[{ html: `c`, type: `html` }], [{ html: `d`, type: `html` }]]],
        type: `table`,
      },
    ]);

    const [htmlTop, listTop, tableTop] = doc;

    expect(htmlTop).toBeDefined();
    expect(listTop).toBeDefined();
    expect(tableTop).toBeDefined();
    expect(htmlTop === undefined ? -1 : topFirstIndex(htmlTop)).toBe(0);
    expect(listTop === undefined ? -1 : topFirstIndex(listTop)).toBe(1);
    expect(tableTop === undefined ? -1 : topFirstIndex(tableTop)).toBe(2);
  });
});
