/* eslint-disable @typescript-eslint/promise-function-async */
import type { ReactNode } from "react";

import { _ } from "@snappy/core";

import type { useAiStreamerState } from "./AiStreamer.state";

import {
  type AnnotatedBody,
  type AnnotatedLeaf,
  type AnnotatedList,
  type AnnotatedTable,
  type AnnotatedTopPiece,
  type SegmentMode,
  Stream,
} from "../core";
import styles from "./AiStreamer.module.scss";
import { StreamHtml } from "./StreamHtml";

export type AiStreamerViewProps = ReturnType<typeof useAiStreamerState>;

export const AiStreamerView = ({
  doc,
  playIndex,
  pushTailHtml,
  streaming,
  tailHost,
  theme,
  typeWriterSpeed,
  waitingHost,
}: AiStreamerViewProps) => {
  const typeWriter = typeWriterSpeed !== undefined;
  const chunkClass = styles.chunk;
  const { Code, List, ListItemBody, Table, TableCellBody } = theme.components;
  const mode = (index: number): SegmentMode => Stream.segmentMode(index, playIndex, streaming);
  const show = (firstIndex: number) => Stream.showNode(firstIndex, playIndex, streaming);

  const whenShown = (firstIndex: number, render: () => ReactNode | undefined) =>
    show(firstIndex) ? render() : undefined;

  const slot = (leaf: AnnotatedLeaf, key: string): ReactNode | undefined => {
    const segmentMode = mode(leaf.index);
    if (segmentMode === `pending`) {
      return undefined;
    }

    const tail = segmentMode === `tail`;
    const host = tail && typeWriter ? tailHost : undefined;

    return leaf.kind === `code` ? (
      <Code
        key={key}
        onTailHtml={tail && typeWriter ? pushTailHtml : undefined}
        piece={{ closed: leaf.closed, html: leaf.html, lang: leaf.lang, source: leaf.source, type: `code` }}
        tailHostRef={host}
      />
    ) : (
      <StreamHtml cn={chunkClass} html={leaf.html} key={key} tailHostRef={host} />
    );
  };

  const body = (pieces: AnnotatedBody, prefix: string): ReactNode[] | undefined => {
    const nodes = pieces.flatMap((leaf, index) => {
      const node = slot(leaf, `${prefix}:${index}`);

      return node === undefined ? [] : [node];
    });

    return nodes.length === 0 ? undefined : nodes;
  };

  const list = (piece: AnnotatedList, prefix: string): ReactNode | undefined =>
    whenShown(piece.firstIndex, () => {
      const Tag = piece.kind === `ordered` ? `ol` : `ul`;

      const items = piece.items.flatMap((item, index) => {
        if (!show(item.firstIndex)) {
          return [];
        }

        const content = body(item.body, `${prefix}:b${index}`);
        const nested = item.children === undefined ? undefined : list(item.children, `${prefix}:${index}`);

        if (content === undefined && nested === undefined) {
          return [];
        }

        return [
          <li key={streaming ? `${prefix}:${index}` : `${prefix}:${item.firstIndex}`}>
            {content === undefined ? undefined : <ListItemBody>{content}</ListItemBody>}
            {nested}
          </li>,
        ];
      });

      return items.length === 0 ? undefined : <Tag>{items}</Tag>;
    });

  const table = (piece: AnnotatedTable, prefix: string): ReactNode | undefined =>
    whenShown(piece.firstIndex, () => {
      const rows = piece.rows.flatMap((row, ri) => {
        const cells = row.flatMap((cell, ci) => {
          if (!show(cell.firstIndex)) {
            return [];
          }

          const content = body(cell.body, `${prefix}:r${ri}:c${ci}`);
          if (content === undefined) {
            return [];
          }

          const Cell = ri === 0 ? `th` : `td`;

          return [
            <Cell key={streaming ? `${prefix}:r${ri}:c${ci}` : `${prefix}:c${cell.firstIndex}`}>
              <TableCellBody>{content}</TableCellBody>
            </Cell>,
          ];
        });

        const rowKey = row[0]?.firstIndex ?? prefix;

        return cells.length === 0 ? [] : [<tr key={`${prefix}:r${rowKey}`}>{cells}</tr>];
      });

      return rows.length === 0 ? undefined : <Table key={prefix} rows={rows} />;
    });

  const top = (piece: AnnotatedTopPiece, index: number): ReactNode | undefined => {
    if (`type` in piece) {
      if (piece.type === `list`) {
        if (!show(piece.list.firstIndex)) {
          return undefined;
        }

        const tree = list(piece.list, `list-${index}`);

        return tree === undefined ? undefined : <List key={`list-${index}`}>{tree}</List>;
      }

      return table(piece.table, `table-${index}`);
    }

    return slot(piece, `top-${index}`);
  };

  const nodes = doc.flatMap((piece, index) => {
    const node = top(piece, index);

    return node === undefined ? [] : [node];
  });

  const content = nodes.length === 0 ? undefined : nodes;

  return (
    <div className={_.cn(theme.cn, styles.root)}>
      {content}
      {waitingHost ? <div className={styles.chunk} ref={tailHost} /> : undefined}
    </div>
  );
};
