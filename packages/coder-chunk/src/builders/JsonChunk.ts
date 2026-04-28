import { TreeSitterChunk } from "../factory/TreeSitterChunk";

export const JsonChunk = TreeSitterChunk({
  extensions: [`.json`],
  language: `json`,
  nodes: new Set([`array`, `object`, `pair`]),
});
