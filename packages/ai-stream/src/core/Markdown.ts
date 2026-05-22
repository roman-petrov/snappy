/* eslint-disable functional/no-expression-statements */
/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import { _ } from "@snappy/core";
import { Remend } from "@snappy/remend";
import { Marked, type Token, type Tokens } from "marked";

import type { ListItem, ListPiece, Piece, TablePiece, TableRow } from "./Types";

const marked = new Marked({ async: false, breaks: true, gfm: true });

marked.use({ hooks: { preprocess: Remend.apply } });

const tokenHtml = (token: Token) => {
  const html = marked.parser([token]);

  return _.isString(html) ? html : ``;
};

const paragraphFrom = (tokens: readonly Token[]): Tokens.Paragraph => ({
  raw: ``,
  text: ``,
  tokens: [...tokens],
  type: `paragraph`,
});

const cellPieces = (tokens: readonly Token[]): Piece[] =>
  tokens.length === 0 ? [] : [{ html: tokenHtml(paragraphFrom(tokens)), type: `html` }];

const tablePiece = (token: Tokens.Table): TablePiece => {
  const header: TableRow = token.header.map(cell => cellPieces(cell.tokens));
  const body = token.rows.map(row => row.map(cell => cellPieces(cell.tokens)));

  return { html: tokenHtml(token), rows: [header, ...body], type: `table` };
};

const listItem: (item: Tokens.ListItem) => ListItem = item => {
  const { tokens } = item;
  const nestedAt = tokens.findIndex(entry => entry.type === `list`);

  if (nestedAt === -1) {
    return { body: piecesFromTokens(tokens) };
  }

  return { body: piecesFromTokens(tokens.slice(0, nestedAt)), children: listPiece(tokens[nestedAt] as Tokens.List) };
};

const listPiece = (token: Tokens.List): ListPiece => ({
  html: tokenHtml(token),
  items: token.items.map(listItem),
  kind: token.ordered ? `ordered` : `unordered`,
  type: `list`,
});

const piecesFromTokens = (tokens: readonly Token[]): Piece[] =>
  tokens.flatMap((token): Piece[] =>
    token.type === `space`
      ? []
      : token.type === `code`
        ? [{ closed: true, html: tokenHtml(token), lang: token.lang, source: token.text, type: `code` }]
        : token.type === `list`
          ? [listPiece(token as Tokens.List)]
          : token.type === `table`
            ? [tablePiece(token as Tokens.Table)]
            : [{ html: tokenHtml(token), type: `html` }],
  );

const pieces = (source: string) => piecesFromTokens(marked.lexer(Remend.apply(source)));

const html = (source: string) => {
  const parsed = marked.parse(source, { async: false });

  return _.isString(parsed) ? parsed : ``;
};

export const Markdown = { html, pieces };
