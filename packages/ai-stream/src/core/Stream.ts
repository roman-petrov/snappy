/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-loop-statements */
import type { CodePiece, HtmlPiece, ListItem, ListPiece, Piece, TablePiece } from "./Types";

export type AnnotatedBody = readonly AnnotatedLeaf[];

export type AnnotatedCodeLeaf = {
  closed: boolean;
  html: string;
  index: number;
  kind: `code`;
  lang: string | undefined;
  source: string;
};

export type AnnotatedDocument = readonly AnnotatedTopPiece[];

export type AnnotatedHtmlLeaf = { html: string; index: number; kind: `html` };

export type AnnotatedLeaf = AnnotatedCodeLeaf | AnnotatedHtmlLeaf;

export type AnnotatedList = { firstIndex: number; items: readonly AnnotatedListItem[]; kind: `ordered` | `unordered` };

export type AnnotatedListItem = { body: AnnotatedBody; children?: AnnotatedList; firstIndex: number };

export type AnnotatedTable = { firstIndex: number; rows: readonly AnnotatedTableRow[] };

export type AnnotatedTableCell = { body: AnnotatedBody; firstIndex: number };

export type AnnotatedTableRow = readonly AnnotatedTableCell[];

export type AnnotatedTopPiece =
  | AnnotatedCodeLeaf
  | AnnotatedHtmlLeaf
  | { list: AnnotatedList; type: `list` }
  | { table: AnnotatedTable; type: `table` };

export type CodeSegment = { html: string; kind: `code`; lang: string | undefined; source: string };

export type HtmlSegment = { html: string; kind: `html` };

export type Segment = CodeSegment | HtmlSegment;

export type SegmentMode = `done` | `pending` | `tail`;

type Cursor = { at: number; segments: Segment[] };

type NonHtmlPiece = Exclude<Piece, HtmlPiece>;

const segmentMode = (index: number, playIndex: number, streaming: boolean): SegmentMode =>
  !streaming || index < playIndex ? `done` : index === playIndex ? `tail` : `pending`;

const showNode = (firstIndex: number, playIndex: number, streaming: boolean) => !streaming || firstIndex <= playIndex;
const bodyLastIndex = (body: AnnotatedBody) => body.at(-1)?.index ?? -1;

const listLastIndex = (list: AnnotatedList): number => {
  let last = list.firstIndex - 1;

  for (const item of list.items) {
    last = Math.max(last, bodyLastIndex(item.body));
    if (item.children !== undefined) {
      last = Math.max(last, listLastIndex(item.children));
    }
  }

  return last;
};

const tableLastIndex = (table: AnnotatedTable): number => {
  let last = table.firstIndex - 1;

  for (const row of table.rows) {
    for (const cell of row) {
      last = Math.max(last, bodyLastIndex(cell.body));
    }
  }

  return last;
};

const topFirstIndex = (piece: AnnotatedTopPiece) =>
  `type` in piece ? (piece.type === `list` ? piece.list.firstIndex : piece.table.firstIndex) : piece.index;

const topLastIndex = (piece: AnnotatedTopPiece) => {
  if (`type` in piece) {
    return piece.type === `list` ? listLastIndex(piece.list) : tableLastIndex(piece.table);
  }

  return piece.index;
};

const sealCount = (doc: AnnotatedDocument, playIndex: number) => {
  let count = 0;

  for (const piece of doc) {
    if (topLastIndex(piece) < playIndex) {
      count += 1;
    } else {
      break;
    }
  }

  return count;
};

const pushHtml = (cursor: Cursor, html: string): AnnotatedHtmlLeaf | undefined => {
  if (html === ``) {
    return undefined;
  }

  const index = cursor.at;
  cursor.segments.push({ html, kind: `html` });
  cursor.at += 1;

  return { html, index, kind: `html` };
};

const pushCode = (cursor: Cursor, piece: CodePiece): AnnotatedCodeLeaf => {
  const index = cursor.at;
  cursor.segments.push({ html: piece.html, kind: `code`, lang: piece.lang, source: piece.source });
  cursor.at += 1;

  return { closed: piece.closed, html: piece.html, index, kind: `code`, lang: piece.lang, source: piece.source };
};

const scanHtml = (
  list: readonly Piece[],
  cursor: Cursor,
  sink: (leaf: AnnotatedHtmlLeaf) => void,
  onOther: (piece: NonHtmlPiece, flush: () => void) => void,
) => {
  let htmlRun = ``;

  const flush = () => {
    const leaf = pushHtml(cursor, htmlRun);
    htmlRun = ``;
    if (leaf !== undefined) {
      sink(leaf);
    }
  };

  for (const piece of list) {
    if (piece.type === `html`) {
      htmlRun += piece.html;
    } else {
      onOther(piece, flush);
    }
  }

  flush();
};

const annotateBody = (list: readonly Piece[], cursor: Cursor): AnnotatedBody => {
  const leaves: AnnotatedLeaf[] = [];

  scanHtml(
    list,
    cursor,
    leaf => leaves.push(leaf),
    (piece, flush) => {
      if (piece.type === `code`) {
        flush();
        leaves.push(pushCode(cursor, piece));
      }
    },
  );

  return leaves;
};

const annotateList = (piece: ListPiece, cursor: Cursor): AnnotatedList => {
  const annotateListItem = (item: ListItem): AnnotatedListItem => {
    const firstIndex = cursor.at;
    const body = annotateBody(item.body, cursor);
    const children = item.children === undefined ? undefined : annotateList(item.children, cursor);

    return { body, children, firstIndex };
  };

  return { firstIndex: cursor.at, items: piece.items.map(annotateListItem), kind: piece.kind };
};

const annotateCell = (cell: readonly Piece[], cursor: Cursor): AnnotatedTableCell => {
  const firstIndex = cursor.at;

  return { body: annotateBody(cell, cursor), firstIndex };
};

const annotateTable = (piece: TablePiece, cursor: Cursor): AnnotatedTable => {
  const firstIndex = cursor.at;
  const rows: AnnotatedTableRow[] = piece.rows.map(row => row.map(cell => annotateCell(cell, cursor)));

  return { firstIndex, rows };
};

const annotateTop = (list: readonly Piece[], cursor: Cursor): AnnotatedDocument => {
  const topPieces: AnnotatedTopPiece[] = [];

  scanHtml(
    list,
    cursor,
    leaf => topPieces.push(leaf),
    (piece, flush) => {
      flush();

      switch (piece.type) {
        case `code`: {
          topPieces.push(pushCode(cursor, piece));
          break;
        }
        case `list`: {
          topPieces.push({ list: annotateList(piece, cursor), type: `list` });
          break;
        }
        case `table`: {
          topPieces.push({ table: annotateTable(piece, cursor), type: `table` });
          break;
        }
        // No default
      }
    },
  );

  return topPieces;
};

const annotate = (pieces: readonly Piece[]) => {
  const cursor: Cursor = { at: 0, segments: [] };

  return { doc: annotateTop(pieces, cursor), segments: cursor.segments as readonly Segment[] };
};

const segments = (pieces: readonly Piece[]) => annotate(pieces).segments;

const tailHtml = (segment: Segment | undefined, codeHtml: string) =>
  segment === undefined ? `` : segment.kind === `code` ? codeHtml : segment.html;

const fenceMinTicks = 3;
const fenceIndent = /^ {0,3}/u;

const fenceLine = (line: string) => {
  const indent = fenceIndent.exec(line)?.[0]?.length ?? 0;
  const body = line.slice(indent);
  const tick = body.startsWith(`\``) ? `\`` : body.startsWith(`~`) ? `~` : undefined;

  if (tick === undefined) {
    return undefined;
  }

  let length = 0;

  while (body[length] === tick) {
    length += 1;
  }

  return length < fenceMinTicks ? undefined : { info: body.slice(length).trim(), length, tick };
};

type FenceState = { length: number; tick: string };

const nextFenceState = (open: FenceState | undefined, line: string): FenceState | undefined => {
  const fence = fenceLine(line);

  if (fence === undefined) {
    return open;
  }

  if (open === undefined) {
    return { length: fence.length, tick: fence.tick };
  }

  return fence.tick === open.tick && fence.length >= open.length && fence.info === `` ? undefined : open;
};

const fenceOpen = (source: string) => {
  const scan = (lines: readonly string[], index: number, open: FenceState | undefined): boolean =>
    index >= lines.length ? open !== undefined : scan(lines, index + 1, nextFenceState(open, lines[index] ?? ``));

  return scan(source.split(`\n`), 0, undefined);
};

const apply = (pieces: readonly Piece[], openLastCode = true): Piece[] => {
  let lastCode = -1;

  for (let index = pieces.length - 1; index >= 0; index -= 1) {
    if (pieces[index]?.type === `code`) {
      lastCode = index;
      break;
    }
  }

  return lastCode === -1
    ? [...pieces]
    : pieces.map((piece, index) =>
        index === lastCode && piece.type === `code` && openLastCode ? { ...piece, closed: false } : piece,
      );
};

export const Stream = {
  annotate,
  apply,
  fenceOpen,
  sealCount,
  segmentMode,
  segments,
  showNode,
  tailHtml,
  topFirstIndex,
};
