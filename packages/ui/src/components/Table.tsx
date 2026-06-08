import type { ReactNode } from "react";

import { useTableState } from "./Table.state";
import { TableView } from "./Table.view";

export type TableAlign = `left` | `right`;

export type TableCell = TableContent | { align?: TableAlign; content: TableContent };

export type TableColumn = { align?: TableAlign; content: TableContent; key: string };

export type TableContent = ReactNode | string;

export type TableDataProps = { columns: TableColumn[]; rows: TableRow[] };

export type TableProps = TableDataProps | TableSlotProps;

export type TableRow = Record<string, TableCell> & { id: string };

export type TableSlotProps = { slots: readonly ReactNode[] };

export const Table = (props: TableProps) => <TableView {...useTableState(props)} />;
