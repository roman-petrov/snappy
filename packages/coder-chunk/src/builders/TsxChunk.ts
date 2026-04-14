import typeScript from "tree-sitter-typescript";

import { TypeScriptChunk } from "../factory/TypeScriptChunk";
import { TreeSitter } from "../TreeSitter";

export const TsxChunk = TypeScriptChunk({
  additionalNodes: [`jsx_element`],
  extension: `.tsx`,
  parser: TreeSitter.parser(`.tsx`, typeScript.tsx),
});
