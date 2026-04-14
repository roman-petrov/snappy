import type parser from "tree-sitter";

import { TreeSitterChunk } from "./TreeSitterChunk";

type TreeSitterFixedChunkInput<T extends string> = {
  additionalNodes?: readonly string[];
  extension: T;
  parser: parser | undefined;
};

export const TreeSitterFixedChunk =
  <T extends string>(nodes: readonly string[]) =>
  ({ additionalNodes = [], extension, parser }: TreeSitterFixedChunkInput<T>) =>
    TreeSitterChunk({ extensions: [extension], nodes: new Set([...nodes, ...additionalNodes]), parser });
