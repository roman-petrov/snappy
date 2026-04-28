import type { TreeSitterLanguage } from "../TreeSitter";

import { TreeSitterChunk } from "./TreeSitterChunk";

export type TreeSitterFixedChunkInput = {
  additionalNodes?: readonly string[];
  extensions: readonly string[];
  language: TreeSitterLanguage;
};

export const TreeSitterFixedChunk =
  (nodes: readonly string[]) =>
  ({ additionalNodes = [], extensions, language }: TreeSitterFixedChunkInput) =>
    TreeSitterChunk({ extensions, language, nodes: new Set([...nodes, ...additionalNodes]) });
