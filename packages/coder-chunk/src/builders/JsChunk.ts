import javascript from "tree-sitter-javascript";

import { JavaScriptChunk } from "../factory/JavaScriptChunk";
import { TreeSitter } from "../TreeSitter";

export const JsChunk = JavaScriptChunk({
  additionalNodes: [`lexical_declaration`],
  extension: `.js`,
  parser: TreeSitter.parser(`.js`, javascript),
});
