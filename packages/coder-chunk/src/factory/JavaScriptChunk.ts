import { TreeSitterFixedChunk } from "./TreeSitterFixedChunk";

export const JavaScriptChunk = TreeSitterFixedChunk([
  `arrow_function`,
  `class_declaration`,
  `export_statement`,
  `function_declaration`,
  `function`,
  `generator_function_declaration`,
  `import_statement`,
  `method_definition`,
]);
