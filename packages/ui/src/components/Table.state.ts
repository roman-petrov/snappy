import { _ } from "@snappy/core";

import type { TableAlign, TableCell, TableContent, TableProps } from "./Table";

export const useTableState = (props: TableProps) => {
  if (!(`columns` in props)) {
    return { kind: `slot` as const, slots: props.slots };
  }

  const { columns, rows: sourceRows } = props;

  const isCell = (value: TableCell): value is { align?: TableAlign; content: TableContent } =>
    value !== null && _.isObject(value) && !_.isArray(value) && `content` in value;

  const resolve = (value: TableCell | undefined, columnAlign: TableAlign) =>
    value === undefined
      ? { align: columnAlign, content: undefined }
      : isCell(value)
        ? { align: value.align ?? columnAlign, content: value.content }
        : { align: columnAlign, content: value };

  const headers = columns.map(column => ({
    align: column.align ?? (`left` as const),
    content: column.content,
    key: column.key,
  }));

  const rows = sourceRows.map(row => ({
    cells: columns.map(column => {
      const columnAlign = column.align ?? (`left` as const);
      const { align, content } = resolve(row[column.key], columnAlign);

      return { align, content, key: column.key };
    }),
    id: row.id,
  }));

  return { headers, kind: `data` as const, rows };
};
