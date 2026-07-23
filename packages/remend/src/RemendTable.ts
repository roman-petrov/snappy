import { _ } from "@snappy/core";

import { RemendGrapheme } from "./RemendGrapheme";

const tableMinDashLength = 3;
const tableRow = (line: string) => (line.trimStart()[0] ?? ``) === `|`;

const rowCells = (line: string) =>
  line
    .trim()
    .split(`|`)
    .map(cell => cell.trim())
    .filter(cell => cell.length > 0);

const rowHasCellContent = (line: string) => rowCells(line).some(cell => cell.trim() !== ``);

const dashCells = (line: string, minBodyLength: number) => {
  const cells = rowCells(line);

  return (
    cells.length > 0 &&
    cells.every(cell => {
      const body = cell.replaceAll(`:`, ``);

      return body.length >= minBodyLength && RemendGrapheme.chars(body).every(char => char === `-`);
    })
  );
};

const separatorLike = (line: string) => dashCells(line, 1);
const tableSeparator = (line: string) => tableRow(line) && dashCells(line, tableMinDashLength);
const rowReady = (line: string) => tableSeparator(line) || (rowHasCellContent(line) && !separatorLike(line));

const columnCount = (line: string) => {
  const trimmed = line.trim();
  const body = trimmed.startsWith(`|`) ? (trimmed.endsWith(`|`) ? trimmed.slice(1, -1) : trimmed.slice(1)) : ``;

  return trimmed.startsWith(`|`) ? Math.max(body.split(`|`).length, 1) : 1;
};

const separatorRow = (columns: number) => `|${_.gen(columns, () => ` --- `).join(`|`)}|`;
const completeTableRow = (line: string) => (line.trimEnd().endsWith(`|`) ? line : `${line.trimEnd()} |`);

const lineOffset = (lines: readonly string[], index: number) =>
  lines.slice(0, index).reduce((offset, line) => offset + line.length + 1, 0);

const withoutLines = (text: string, lines: readonly string[], start: number, end: number) =>
  `${text.slice(0, lineOffset(lines, start))}${text.slice(lineOffset(lines, end))}`;

const trailingEnd = (lines: readonly string[]) => {
  const lastContent = lines.findLastIndex(line => line.trim() !== ``);

  return lastContent === -1 ? 0 : lastContent + 1;
};

const blockStart = (lines: readonly string[], end: number): number => {
  const from = (start: number): number => {
    if (start <= 0) {
      return 0;
    }

    const line = lines[start - 1] ?? ``;

    if (tableRow(line)) {
      return from(start - 1);
    }

    if (line.trim() === `` && start < end) {
      const before = lines[start - 2] ?? ``;

      if (tableRow(before)) {
        return from(start - 1);
      }
    }

    return start;
  };

  return from(end);
};

const readyBlock = (block: readonly string[]): readonly string[] =>
  block.length > 1 && !rowReady(block.at(-1) ?? ``) ? readyBlock(block.slice(0, -1)) : block;

const repairBlock = (block: readonly string[]) => {
  const header = block[0] ?? ``;

  if (!rowHasCellContent(header)) {
    return undefined;
  }

  const columns = columnCount(header);
  const separatorIndex = block.findIndex(tableSeparator);
  const hasSeparator = separatorIndex !== -1;

  return hasSeparator
    ? block.map((row, index) =>
        index === separatorIndex && columnCount(row) < columns ? separatorRow(columns) : completeTableRow(row),
      )
    : [header, separatorRow(columns), ...block.slice(1)];
};

const repair = (text: string) => {
  const lines = text.split(`\n`);
  const end = trailingEnd(lines);
  const start = blockStart(lines, end);

  if (end - start < 1) {
    return text;
  }

  const raw = lines.slice(start, end);
  const block = readyBlock(raw.map(completeTableRow));
  const repairedBlock = repairBlock(block);

  return repairedBlock === undefined
    ? withoutLines(text, lines, start, end)
    : [...lines.slice(0, start), ...repairedBlock, ...lines.slice(end)].join(`\n`);
};

export const RemendTable = { repair };
