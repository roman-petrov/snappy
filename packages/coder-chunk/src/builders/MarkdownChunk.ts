import { type BuildChunk, Chunk, type ChunkPart } from "../Chunk";

const build: BuildChunk = ({ path, source }) => {
  const lines = source.split(/\r?\n/u);

  const headingLineIndexes = lines
    .map((line, index) => (/^\s{0,3}#{1,6}\s+\S/u.test(line) ? index : undefined))
    .filter((index): index is number => index !== undefined);

  return headingLineIndexes
    .map((start, index): ChunkPart | undefined => {
      const end = (headingLineIndexes[index + 1] ?? lines.length) - 1;
      const text = lines.slice(start, end + 1).join(`\n`);
      if (text.trim().length === 0) {
        return undefined;
      }

      return { endLine: end + 1, path, startLine: start + 1, text };
    })
    .filter((chunk): chunk is ChunkPart => chunk !== undefined);
};

export const MarkdownChunk = Chunk({ build, extensions: [`.md`, `.mdc`] });
