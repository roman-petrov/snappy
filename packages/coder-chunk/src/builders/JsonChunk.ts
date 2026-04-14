import json from "tree-sitter-json";

import { TreeSitterChunk } from "../factory/TreeSitterChunk";
import { TreeSitter } from "../TreeSitter";

export const JsonChunk = TreeSitterChunk({
  extensions: [`.json`],
  nodes: new Set([`array`, `object`, `pair`]),
  parser: TreeSitter.parser(`.json`, json),
});
