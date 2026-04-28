import { TreeSitterChunk } from "../factory/TreeSitterChunk";

export const JavaChunk = TreeSitterChunk({
  extensions: [`.java`],
  language: `java`,
  nodes: new Set([
    `annotation_type_declaration`,
    `class_declaration`,
    `constructor_declaration`,
    `enum_declaration`,
    `interface_declaration`,
    `method_declaration`,
    `record_declaration`,
  ]),
});
