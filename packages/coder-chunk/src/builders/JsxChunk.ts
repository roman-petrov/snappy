import javascript from "tree-sitter-javascript";

import { JavaScriptChunk } from "../factory/JavaScriptChunk";
import { TreeSitter } from "../TreeSitter";

export const JsxChunk = JavaScriptChunk({
  additionalNodes: [`jsx_element`],
  extension: `.jsx`,
  parser: TreeSitter.parser(`.jsx`, javascript),
});
