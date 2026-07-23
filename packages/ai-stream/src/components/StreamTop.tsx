/* eslint-disable @typescript-eslint/promise-function-async */
import type { TypeWriterSpeed } from "@snappy/domain";

import { memo, type ReactNode } from "react";

import {
  type AnnotatedBody,
  type AnnotatedLeaf,
  type AnnotatedList,
  type AnnotatedTable,
  type AnnotatedTopPiece,
  type SegmentMode,
  Stream,
  type Theme,
} from "../core";
import styles from "./AiStreamer.module.scss";
import { StreamHtml } from "./StreamHtml";

export type StreamTopProps = {
  piece: AnnotatedTopPiece;
  playIndex: number;
  pushTailHtml?: (html: string) => void;
  streaming: boolean;
  tailHost?: (host: HTMLDivElement | null) => void;
  theme: Theme;
  typeWriterSpeed?: TypeWriterSpeed;
};

const whenShown = (firstIndex: number, show: (firstIndex: number) => boolean, render: () => ReactNode | undefined) =>
  show(firstIndex) ? render() : undefined;

const StreamTopView = ({ piece, playIndex, pushTailHtml, streaming, tailHost, theme }: StreamTopProps) => {
  const chunkClass = styles.chunk;
  const { Code, List, ListItemBody, Table, TableCellBody } = theme.components;
  const mode = (index: number): SegmentMode => Stream.segmentMode(index, playIndex, streaming);
  const show = (firstIndex: number) => Stream.showNode(firstIndex, playIndex, streaming);

  const slot = (leaf: AnnotatedLeaf, key: string): ReactNode | undefined => {
    const segmentMode = mode(leaf.index);
    if (segmentMode === `pending`) {
      return undefined;
    }

    const tail = segmentMode === `tail`;
    const host = tail ? tailHost : undefined;

    return leaf.kind === `code` ? (
      <Code
        key={key}
        onTailHtml={host === undefined ? undefined : pushTailHtml}
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

  const list = (node: AnnotatedList, prefix: string): ReactNode | undefined =>
    whenShown(node.firstIndex, show, () => {
      const Tag = node.kind === `ordered` ? `ol` : `ul`;

      const items = node.items.flatMap((item, index) => {
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

  const table = (node: AnnotatedTable, prefix: string): ReactNode | undefined =>
    whenShown(node.firstIndex, show, () => {
      const rows = node.rows.flatMap((row, ri) => {
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

  const key = Stream.topFirstIndex(piece);

  if (`type` in piece) {
    if (piece.type === `list`) {
      if (!show(piece.list.firstIndex)) {
        return undefined;
      }

      const tree = list(piece.list, `list-${key}`);

      return tree === undefined ? undefined : <List>{tree}</List>;
    }

    return table(piece.table, `table-${key}`);
  }

  return slot(piece, `top-${key}`);
};

export const StreamTop = memo(StreamTopView);
