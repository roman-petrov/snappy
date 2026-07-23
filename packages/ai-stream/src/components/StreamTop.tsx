/* eslint-disable @typescript-eslint/promise-function-async */
import { _ } from "@snappy/core";
import { memo, type ReactNode } from "react";

import {
  type AnnotatedBody,
  type AnnotatedLeaf,
  type AnnotatedList,
  type AnnotatedTable,
  type AnnotatedTopPiece,
  Stream,
  type Theme,
} from "../core";
import styles from "./AiStreamer.module.scss";
import { StreamHtml } from "./StreamHtml";

export type StreamTopProps = {
  codeHtmlByIndex: ReadonlyMap<number, string>;
  piece: AnnotatedTopPiece;
  playIndex: number;
  pushTailHtml?: (html: string) => void;
  streaming: boolean;
  tailHost?: (host: HTMLDivElement | null) => void;
  theme: Theme;
};

const StreamTopView = ({
  codeHtmlByIndex,
  piece,
  playIndex,
  pushTailHtml,
  streaming,
  tailHost,
  theme,
}: StreamTopProps) => {
  const { Code, List, ListItemBody, Table, TableCellBody } = theme.components;
  const show = (firstIndex: number) => Stream.showNode(firstIndex, playIndex, streaming);

  const slot = (leaf: AnnotatedLeaf, key: string): ReactNode | undefined => {
    const segmentMode = Stream.segmentMode(leaf.index, playIndex, streaming);
    if (segmentMode === `pending`) {
      return undefined;
    }

    const host = segmentMode === `tail` ? tailHost : undefined;

    return leaf.kind === `code` ? (
      <Code
        key={key}
        onTailHtml={host === undefined ? undefined : pushTailHtml}
        piece={{
          closed: leaf.closed,
          html: codeHtmlByIndex.get(leaf.index) ?? leaf.html,
          lang: leaf.lang,
          source: leaf.source,
          type: `code`,
        }}
        tailHostRef={host}
      />
    ) : (
      <StreamHtml cn={styles.chunk} html={leaf.html} key={key} tailHostRef={host} />
    );
  };

  const body = (pieces: AnnotatedBody, prefix: string): ReactNode[] | undefined => {
    const nodes = pieces.flatMap((leaf, index) => {
      const node = slot(leaf, `${prefix}:${index}`);

      return node === undefined ? [] : [node];
    });

    return nodes.length === 0 ? undefined : nodes;
  };

  const list = (node: AnnotatedList, prefix: string): ReactNode | undefined => {
    if (!show(node.firstIndex)) {
      return undefined;
    }

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
  };

  const table = (node: AnnotatedTable, prefix: string): ReactNode | undefined => {
    if (!show(node.firstIndex)) {
      return undefined;
    }

    const width = Math.max(0, ...node.rows.map(row => row.length));

    const rows = node.rows.flatMap((row, ri) => {
      const Cell = ri === 0 ? `th` : `td`;

      const filled = row.map((cell, ci) => {
        if (!show(cell.firstIndex)) {
          return undefined;
        }

        return body(cell.body, `${prefix}:r${ri}:c${ci}`);
      });

      if (filled.every(content => content === undefined)) {
        return [];
      }

      const cells = _.gen(width, ci => {
        const content = filled[ci];
        const key = `${prefix}:r${ri}:c${ci}`;

        return content === undefined ? (
          <Cell aria-hidden key={`${key}:pad`} />
        ) : (
          <Cell key={streaming ? key : `${prefix}:c${row[ci]?.firstIndex ?? ci}`}>
            <TableCellBody>{content}</TableCellBody>
          </Cell>
        );
      });

      const rowKey = row[0]?.firstIndex ?? prefix;

      return [<tr key={`${prefix}:r${rowKey}`}>{cells}</tr>];
    });

    return rows.length === 0 ? undefined : <Table key={prefix} rows={rows} />;
  };

  const key = Stream.topFirstIndex(piece);

  if (`type` in piece) {
    if (piece.type === `list`) {
      const tree = list(piece.list, `list-${key}`);

      return tree === undefined ? undefined : <List>{tree}</List>;
    }

    return table(piece.table, `table-${key}`);
  }

  return slot(piece, `top-${key}`);
};

export const StreamTop = memo(StreamTopView);
