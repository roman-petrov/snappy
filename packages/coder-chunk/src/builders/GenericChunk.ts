/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-loop-statements */
import type { BuildChunk, ChunkPart } from "../Chunk";

import { Constants } from "../Constants";

export const GenericChunk: BuildChunk = ({ path, source }) => {
  const lines = source.split(/\r?\n/u);
  if (lines.length === 0) {
    return [];
  }

  const fitEndByLength = (start: number, end: number): number => {
    const slice = lines.slice(start, end).join(`\n`);
    if (slice.length <= Constants.maxLength || end <= start + 1) {
      return end;
    }

    return fitEndByLength(start, end - 1);
  };

  const chunkForStart = (start: number) => {
    const tentativeEnd = Math.min(lines.length, start + Constants.genericChunk.targetLines);
    const end = tentativeEnd <= start ? start + 1 : fitEndByLength(start, tentativeEnd);
    const text = lines.slice(start, end).join(`\n`) || (lines[start] ?? ``);

    return { chunk: { endLine: end, path, startLine: start + 1, text }, end };
  };

  let chunks: ChunkPart[] = [];
  let start = 0;
  while (start < lines.length) {
    const { chunk, end } = chunkForStart(start);
    chunks = [...chunks, chunk];
    if (end >= lines.length) {
      break;
    }
    start = Math.max(end - Constants.genericChunk.overlapLines, start + 1);
  }

  return chunks;
};
