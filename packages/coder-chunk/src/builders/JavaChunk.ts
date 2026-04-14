import java from "tree-sitter-java";

import { TreeSitterChunk } from "../factory/TreeSitterChunk";
import { TreeSitter } from "../TreeSitter";

export const JavaChunk = TreeSitterChunk({
  extensions: [`.java`],
  nodes: new Set([
    `annotation_type_declaration`,
    `class_declaration`,
    `constructor_declaration`,
    `enum_declaration`,
    `interface_declaration`,
    `method_declaration`,
    `record_declaration`,
  ]),
  parser: TreeSitter.parser(`.java`, java),
});
