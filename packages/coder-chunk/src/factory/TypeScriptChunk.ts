import { TreeSitterFixedChunk } from "./TreeSitterFixedChunk";

export const TypeScriptChunk = TreeSitterFixedChunk([
  `arrow_function`,
  `class_declaration`,
  `enum_declaration`,
  `export_statement`,
  `function_declaration`,
  `function`,
  `generator_function_declaration`,
  `import_statement`,
  `interface_declaration`,
  `method_definition`,
  `module`,
  `type_alias_declaration`,
]);
