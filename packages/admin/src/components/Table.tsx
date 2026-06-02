import type { ReactNode } from "react";

import { useTableState } from "./Table.state";
import { TableView } from "./Table.view";

export type TableAlign = `left` | `right`;

export type TableCell = TableContent | { align?: TableAlign; content: TableContent };

export type TableColumn = { align?: TableAlign; content: TableContent; key: string };

export type TableContent = ReactNode | string;

export type TableProps = { columns: TableColumn[]; rows: TableRow[] };

export type TableRow = Record<string, TableCell> & { id: string };

export const Table = (props: TableProps) => <TableView {...useTableState(props)} />;
