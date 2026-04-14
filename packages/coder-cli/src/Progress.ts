/* eslint-disable functional/no-expression-statements */
import { Terminal } from "@snappy/node";

import { Theme } from "./Theme";

const barWidth = 32;
const labelMaxChars = 44;
const pctPadWidth = 3;
const percentFull = 100;
const terminalClearWidth = 120;

const shortenPath = (raw: string, max = labelMaxChars) =>
  raw.length <= max ? raw.padEnd(max, ` `) : `…${raw.slice(-(max - 1))}`;

const writeIndexerProgressLine = ({
  filesDone,
  filesTotal,
  path: filePath,
}: {
  filesDone: number;
  filesTotal: number;
  path: string;
}) => {
  const total = Math.max(filesTotal, 1);
  const step = Math.min(filesDone + 1, total);
  const pct = Math.min(percentFull, Math.round((step / total) * percentFull));
  const filled = Math.round((pct / percentFull) * barWidth);
  const bar = `${`█`.repeat(filled)}${`░`.repeat(Math.max(barWidth - filled, 0))}`;
  const ratio = `${String(step).padStart(String(total).length, ` `)}/${String(total)}`;
  const line = `\r[${Theme.command(bar)}] ${Terminal.bold(`${String(pct).padStart(pctPadWidth, ` `)}%`)} ${Theme.dim(ratio)} ${shortenPath(filePath)}`;

  process.stdout.write(line);
};

const finishIndexerProgressLine = (summary: string) => {
  process.stdout.write(`\r${` `.repeat(terminalClearWidth)}\r`);
  process.stdout.write(`${summary}\n`);
};

export const Progress = { finishIndexerProgressLine, writeIndexerProgressLine };
