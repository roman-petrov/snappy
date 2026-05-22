/* eslint-disable @typescript-eslint/naming-convention */
import type { ComponentType, ReactNode, Ref } from "react";

export type CodePiece = { closed: boolean; html: string; lang: string | undefined; source: string; type: `code` };

export type CodeViewProps = {
  onTailHtml?: (html: string) => void;
  piece: CodePiece;
  tailHostRef?: Ref<HTMLDivElement | null>;
};

export type HtmlPiece = { html: string; type: `html` };

export type ListItem = { body: readonly Piece[]; children?: ListPiece };

export type ListPiece = { html: string; items: readonly ListItem[]; kind: `ordered` | `unordered`; type: `list` };

export type ListViewProps = { children: ReactNode };

export type Piece = CodePiece | HtmlPiece | ListPiece | TablePiece;

export type TableCell = readonly Piece[];

export type TablePiece = { html: string; rows: readonly TableRow[]; type: `table` };

export type TableRow = readonly TableCell[];

export type TableViewProps = { rows: readonly ReactNode[] };

export type Theme = { cn: string; components: ThemeComponents };

export type ThemeComponents = {
  Code: ComponentType<CodeViewProps>;
  List: ComponentType<ListViewProps>;
  ListItemBody: ComponentType<{ children: ReactNode }>;
  Table: ComponentType<TableViewProps>;
  TableCellBody: ComponentType<{ children: ReactNode }>;
};
