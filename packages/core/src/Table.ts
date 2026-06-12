import { Unicode } from "./Unicode";

const visibleLength = (text: string) => Unicode.stripAnsi(text).length;
const gap = `  `;
const pad = (text: string, width: number) => `${text}${` `.repeat(Math.max(0, width - visibleLength(text)))}`;

const widths = (rows: readonly (readonly string[])[]) => {
  const columns = Math.max(0, ...rows.map(row => row.length));

  return Array.from({ length: columns }, (_, column) =>
    Math.max(0, ...rows.map(row => visibleLength(row[column] ?? ``))),
  );
};

const line = (cells: readonly string[], columnWidths: readonly number[]) =>
  cells.map((cell, column) => pad(cell, columnWidths[column] ?? 0)).join(gap);

const format = (rows: readonly (readonly string[])[]) =>
  rows.length === 0 ? `` : rows.map(cells => line(cells, widths(rows))).join(`\n`);

export const Table = { format };
