import { _ } from "@snappy/core";

import type { Chunk as ChunkBuilder, ChunkInput, ChunkPart } from "./Chunk";

import {
  CssChunk,
  GenericChunk,
  JavaChunk,
  JsChunk,
  JsonChunk,
  JsxChunk,
  MarkdownChunk,
  ScssChunk,
  TsChunk,
  TsxChunk,
} from "./builders";
import { Constants } from "./Constants";

export type CoderChunk = { chunkIndex: number; endLine: number; path: string; startLine: number; text: string };

const build = (relativePath: string, source: string): CoderChunk[] => {
  const extension = relativePath.slice(relativePath.lastIndexOf(`.`)).toLowerCase();
  const input: ChunkInput = { path: relativePath, source };

  const builders: ChunkBuilder[] = [
    CssChunk,
    JavaChunk,
    JsChunk,
    JsonChunk,
    JsxChunk,
    MarkdownChunk,
    ScssChunk,
    TsChunk,
    TsxChunk,
  ];

  const chunksByExtension = _.fromEntries(
    builders.flatMap(builder => builder.extensions.map(value => [value, builder.build] as const)),
  );

  const withChunkIndex = (parts: ChunkPart[], chunkIndex: number): CoderChunk[] => {
    const [current, ...tail] = parts;
    if (current === undefined) {
      return [];
    }
    const created =
      current.text.length <= Constants.maxLength
        ? [
            {
              chunkIndex,
              endLine: current.endLine,
              path: current.path,
              startLine: current.startLine,
              text: current.text,
            },
          ]
        : _.gen(Math.ceil(current.text.length / (Constants.maxLength - Constants.intraTextOverlapChars)), index => {
            const step = Constants.maxLength - Constants.intraTextOverlapChars;
            const offset = index * step;
            const piece = current.text.slice(offset, offset + Constants.maxLength);

            return {
              chunkIndex: chunkIndex + index,
              endLine: current.endLine,
              path: current.path,
              startLine: current.startLine,
              text: piece,
            };
          }).filter(chunk => chunk.text.length > 0);

    return [...created, ...withChunkIndex(tail, chunkIndex + created.length)];
  };

  return withChunkIndex((chunksByExtension[extension] ?? GenericChunk)(input), 0);
};

export const CoderChunk = { build };
