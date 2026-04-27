import css from "tree-sitter-css";

import { StyleChunk } from "../factory/StyleChunk";
import { TreeSitter } from "../TreeSitter";

export const ScssChunk = StyleChunk({
  additionalNodes: [`ERROR`],
  extension: `.scss`,
  parser: TreeSitter.parser(`.scss`, css),
});
